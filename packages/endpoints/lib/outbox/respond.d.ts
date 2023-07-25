import { OutboxPostEndpoint } from '.';
export declare function respond(this: OutboxPostEndpoint): Promise<{
    statusCode: number;
    json: {
        error: string;
    };
    location?: undefined;
} | {
    statusCode: number;
    location: string;
    json?: undefined;
}>;
