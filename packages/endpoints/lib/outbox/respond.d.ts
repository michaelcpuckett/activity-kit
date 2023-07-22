import { OutboxPostEndpoint } from '.';
export declare function respond(this: OutboxPostEndpoint): Promise<{
    statusCode: number;
    contentType: string;
    location: string;
}>;
