import { IncomingMessage } from 'http';
import { AP } from 'activitypub-core-types';
import { ServiceAccount } from 'firebase-admin';
import type { ServerResponse } from 'http';
import type { Database } from 'activitypub-core-types';
export declare const homeGetHandler: (
  req: IncomingMessage,
  res: ServerResponse,
  serviceAccount: ServiceAccount,
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
