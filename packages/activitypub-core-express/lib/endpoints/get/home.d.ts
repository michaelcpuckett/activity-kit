import type { IncomingMessage, ServerResponse } from 'http';
export declare const handleHomeGetRequest: (req: IncomingMessage, res: ServerResponse & {
    render: Function;
}) => Promise<void>;
