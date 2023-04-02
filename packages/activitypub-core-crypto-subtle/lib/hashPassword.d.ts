import { SubtleCryptoAdapter } from '.';
export declare function hashPassword(this: SubtleCryptoAdapter, password: string, salt: string): Promise<string>;
