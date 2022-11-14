/// <reference types="node" />
/// <reference types="node" />
import type { AuthAdapter, DbAdapter } from 'activitypub-core-types';
import { IncomingMessage, ServerResponse } from 'http';
export declare const oidcRouteHandler: ({ client_id, client_secret, redirect_uris, adapters }: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
    adapters: {
        db: DbAdapter;
        auth: AuthAdapter;
    };
}) => {
    oidc: (req: IncomingMessage | import("http2").Http2ServerRequest, res: import("http2").Http2ServerResponse | ServerResponse<IncomingMessage>) => void;
    interactio: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    abort: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    confirm: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
    login: (req: IncomingMessage, res: ServerResponse) => Promise<void>;
};
