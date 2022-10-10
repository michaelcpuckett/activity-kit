import { DatabaseService } from '../../DatabaseService';
import { ServiceAccount } from 'firebase-admin';
import { AP } from '../../types';
import type { IncomingMessage, ServerResponse } from 'http';
declare const _default: (serviceAccount: ServiceAccount, setup?: (actor: AP.Entity, databaseService: DatabaseService) => Promise<{
    actor: AP.Actor;
}>) => (req: IncomingMessage, res: ServerResponse) => Promise<void>;
export default _default;
