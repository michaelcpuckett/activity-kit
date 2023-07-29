import * as AP from '@activity-kit/types';
import { Core } from '.';
export declare const getStreamByName: (this: Core, actor: AP.Actor, name: string) => Promise<AP.EitherCollection | null>;
