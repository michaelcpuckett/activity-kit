import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
export declare function getActorByUserId(this: CoreLibrary, userId: string): Promise<AP.Actor | null>;
