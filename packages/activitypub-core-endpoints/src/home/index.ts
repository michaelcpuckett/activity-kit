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

  actor.inbox = await databaseService.expandEntity(actor.inbox);
  actor.outbox = await databaseService.expandEntity(actor.outbox);

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
