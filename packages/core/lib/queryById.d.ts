/// <reference types="node" />
import * as AP from '@activity-kit/types';
import { CoreLibrary } from '.';
export declare function queryById(this: CoreLibrary, id: URL): Promise<AP.Entity | null>;
