/// <reference types="node" />
/// <reference types="node" />
export declare const oidcRouteHandler: ({ client_id, client_secret, redirect_uris }: {
    client_id: any;
    client_secret: any;
    redirect_uris: any;
}) => (req: import("http").IncomingMessage | import("http2").Http2ServerRequest, res: import("http2").Http2ServerResponse | import("http").ServerResponse<import("http").IncomingMessage>) => void;
