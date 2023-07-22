import { Core } from '.';
import * as AP from '@activity-kit/types';
export declare const getStreamByName: (this: Core, actor: AP.Actor, name: string) => Promise<AP.EitherCollection | null>;
