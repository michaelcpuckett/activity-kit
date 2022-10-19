import { IncomingMessage } from 'http';
import { AP } from 'activitypub-core-types';
import type { ServerResponse } from 'http';
import type { Database, Auth } from 'activitypub-core-types';
export declare const homeGetHandler: (
  req: IncomingMessage,
  res: ServerResponse,
  authenticationService: Auth,
  databaseService: Database,
  setup?: (
    data: {
      props?: {
        actor?: AP.Actor;
      };
    },
    databaseService: Database,
  ) => Promise<{
    props?: {
      actor?: AP.Actor;
    };
  }>,
) => Promise<{
  redirect?: {
    permanent: Boolean;
    destination: string;
  };
  props?: {
    actor?: AP.Actor;
  };
}>;
