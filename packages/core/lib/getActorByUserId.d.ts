import * as AP from '@activity-kit/types';
import { Core } from '.';
export declare function getActorByUserId(this: Core, userId: string): Promise<AP.Actor | null>;
