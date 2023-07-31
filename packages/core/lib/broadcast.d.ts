import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
export declare function broadcast(this: CoreLibrary, activity: AP.Activity, actor: AP.Actor): Promise<Record<string, number>>;
