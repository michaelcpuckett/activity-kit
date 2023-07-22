import * as AP from '@activity-kit/types';
import { EntityGetEndpoint } from '.';
export declare function respond(this: EntityGetEndpoint, render: (args: {
    entity: AP.Entity;
}) => Promise<string>): Promise<{
    statusCode: number;
    contentType?: string;
    body: string;
}>;
