import * as crypto from 'crypto';

export const getGuid = () => crypto.randomBytes(16).toString('hex');
