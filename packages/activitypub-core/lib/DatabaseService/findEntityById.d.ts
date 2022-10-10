/// <reference types="node" />
import { DatabaseService } from '.';
import { AP } from '../types';
export declare function findEntityById(this: DatabaseService, id: URL): Promise<AP.Entity | null>;
