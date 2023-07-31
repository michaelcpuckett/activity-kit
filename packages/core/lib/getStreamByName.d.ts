import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
export declare function getStreamByName(this: CoreLibrary, actor: AP.Actor, name: string): Promise<AP.EitherCollection | null>;
