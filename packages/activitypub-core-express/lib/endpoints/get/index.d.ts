import type { Request } from "express";
import type { ServerResponse } from "http";
export declare const handleIndexGetRequest: (req: Request, res: ServerResponse & {
    render: Function;
}) => Promise<void>;
