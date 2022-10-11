import { IncomingMessage } from 'http';
import { AP } from 'activitypub-core-types';
import { DatabaseService } from '../../DatabaseService';
import { ServiceAccount } from 'firebase-admin';
import { convertUrlsToStrings } from '../../utilities/convertUrlsToStrings';
import cookie from 'cookie';
import type { ServerResponse } from 'http';

export const homeGetHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  serviceAccount: ServiceAccount,
  setup?: (
    props: { actor: AP.Actor },
    databaseService: DatabaseService,
  ) => Promise<{ actor: AP.Actor }>,
  providedDatabaseService?: DatabaseService,
) => {
  const databaseService =
    providedDatabaseService ?? (await DatabaseService.connect());
  const cookies = cookie.parse(req.headers.cookie);

  const actor = await databaseService.getActorByToken(
    cookies.__session ?? '',
    serviceAccount,
  );

  if (!actor) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  }

  if (!actor.inbox || !actor.outbox) {
    throw new Error('Bad actor.');
  }

  const [
    inbox,
    outbox,
    followers,
    following,
  ] = await Promise.all([
    databaseService.expandCollection(actor.inbox),
    databaseService.expandCollection(actor.outbox),
    ...actor.followers ? [databaseService.expandCollection(actor.followers)] : [],
    ...actor.following ? [databaseService.expandCollection(actor.following)] : [],
  ]);

  if (!inbox || !outbox) {
    throw new Error('Bad actor.');
  }

  actor.inbox = inbox as AP.OrderedCollection;
  actor.outbox = outbox as AP.OrderedCollection;

  if (followers) {
    actor.followers = followers as AP.Collection;
  }

  if (following) {
    actor.following = following as AP.Collection;
  }

  const streams: AP.EitherCollection[] = [];

  for (const stream of actor.streams || []) {
    if (stream instanceof URL) {
      const foundStream = await databaseService.findEntityById(stream);

      if (
        foundStream &&
        (foundStream.type === AP.CollectionTypes.COLLECTION ||
          foundStream.type === AP.CollectionTypes.ORDERED_COLLECTION)
      ) {
        const expandedStream = await databaseService.expandCollection(
          foundStream,
        );

        if (expandedStream) {
          streams.push(expandedStream);
        }
      }
    } else {
      const expandedStream = await databaseService.expandCollection(stream);

      if (expandedStream) {
        streams.push(expandedStream);
      }
    }
  }

  if (actor.streams) {
    actor.streams = streams;
  }

  let props = {
    actor,
  };

  if (setup) {
    props = await setup(props, databaseService);
  }

  return {
    props: {
      actor: convertUrlsToStrings(props.actor),
    },
  };
};
