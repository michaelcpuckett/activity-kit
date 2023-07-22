import { EntityGetEndpoint } from '.';
export declare function respond(this: EntityGetEndpoint, render: (...args: unknown[]) => Promise<string>): Promise<{
    statusCode: number;
    contentType?: string;
    body: string;
}>;
