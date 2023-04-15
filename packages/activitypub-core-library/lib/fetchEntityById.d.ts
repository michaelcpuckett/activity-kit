/// <reference types="node" />
import { CoreLibrary } from '.';
import { AP } from 'activitypub-core-types';
export declare function fetchEntityById(this: CoreLibrary, id: URL): Promise<AP.Entity | null>;
