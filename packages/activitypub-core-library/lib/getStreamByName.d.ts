import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
export declare const getStreamByName: (this: CoreLibrary, actor: AP.Actor, name: string) => Promise<AP.EitherCollection | null>;
