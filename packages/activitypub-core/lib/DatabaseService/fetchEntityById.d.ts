/// <reference types="node" />
import { DatabaseService } from '.';
import { AP } from '../types';
export declare function fetchEntityById(this: DatabaseService, id: URL): Promise<AP.Entity | null>;
