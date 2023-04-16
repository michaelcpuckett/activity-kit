/// <reference types="node" />
import { Core } from '.';
import { AP } from '@activity-kit/types';
export declare function findEntityById(this: Core, id: URL): Promise<AP.Entity | null>;
