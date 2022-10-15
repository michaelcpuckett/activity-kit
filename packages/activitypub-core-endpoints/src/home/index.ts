import { IncomingMessage } from 'http';
import { AP } from 'activitypub-core-types';
import { convertUrlsToStrings } from 'activitypub-core-utilities';
import cookie from 'cookie';
import type { ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';

export const homeGetHandler = async (
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  setup?: (
    data: { props?: { actor?: AP.Actor } },
    databaseService: Database,
  ) => Promise<{ props?: { actor?: AP.Actor } }>,
): Promise<{
  redirect?: { permanent: Boolean; destination: string };
  props?: { actor?: AP.Actor };
}> => {
  const cookies = cookie.parse(req.headers.cookie ?? '');

  const actor = await databaseService.getActorByUserId(
    await authenticationService.getUserIdByToken(cookies.__session ?? ''),
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

  const [inbox, outbox, followers, following] = await Promise.all([
    databaseService.expandCollection(actor.inbox),
    databaseService.expandCollection(actor.outbox),
    ...(actor.followers
      ? [databaseService.expandCollection(actor.followers)]
      : []),
    ...(actor.following
      ? [databaseService.expandCollection(actor.following)]
      : []),
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

  let data: {
    props?: {
      actor?: AP.Actor;
    };
  } = {
    props: {
      actor,
    },
  };

  if (setup) {
    data = await setup(data, databaseService);
  }

  return {
    props: {
      actor: convertUrlsToStrings(data.props.actor) as AP.Actor,
    },
  };
};
