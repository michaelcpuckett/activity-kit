import { Core } from '.';
import { AP } from '@activity-kit/types';
export declare function getActorByUserId(this: Core, userId: string): Promise<AP.Actor | null>;
