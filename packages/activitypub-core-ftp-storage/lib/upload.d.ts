/// <reference types="node" />
import type { File } from 'formidable';
export declare function upload(file: File): Promise<URL>;
