import { EntityGetEndpoint } from '.';
import * as AP from '@activity-kit/types';
export declare function handleFoundEntity(this: EntityGetEndpoint, entity: AP.Entity, render: (...args: unknown[]) => Promise<string>): Promise<{
    statusCode: number;
    body: string;
}>;
