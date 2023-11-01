import * as AP from '@activity-kit/types';
import { Result } from '../types';
import { EntityGetEndpoint } from '.';
export declare function respond(this: EntityGetEndpoint, render: (entity: AP.Entity) => Promise<string>): Promise<Result>;
