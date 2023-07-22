import { EntityGetEndpoint } from '.';
import { AP } from '@activity-kit/types';
export declare function respond(this: EntityGetEndpoint, render: (args: {
    entity: AP.Entity;
}) => Promise<string>): Promise<{
    statusCode: number;
    contentType?: string;
    body: string;
}>;
