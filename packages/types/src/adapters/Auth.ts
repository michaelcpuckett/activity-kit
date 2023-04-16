import { DbAdapter } from './Db';

export type AuthAdapter = {
  adapters?: { db: DbAdapter };
  params?: { [key: string]: unknown };

  getTokenByUserId: (userId: string) => Promise<string>;
  createUser: (
    this: AuthAdapter,
    {
      email,
      password,
      preferredUsername,
    }: {
      email: string;
      password?: string;
      preferredUsername: string;
    },
  ) => Promise<{
    uid: string;
    token: string;
  }>;
  getUserIdByToken: (this: AuthAdapter, token: string) => Promise<string>;
  authenticatePassword: (
    this: AuthAdapter,
    email: string,
    password: string,
  ) => Promise<{ uid: string; token: string } | null>;
};
