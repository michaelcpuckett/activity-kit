/// <reference types="node" />
import { Core } from '.';
import * as AP from '@activity-kit/types';
export declare function findEntityById(this: Core, id: URL): Promise<AP.Entity | null>;
