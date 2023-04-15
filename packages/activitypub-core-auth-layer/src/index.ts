import { AuthAdapter, CryptoAdapter } from 'activitypub-core-types';

export class AuthLayer {
  getTokenByUserId: (userId: string) => Promise<string>;
  createUser: ({
    email,
    password,
    preferredUsername,
  }: {
    email: string;
    password?: string;
    preferredUsername: string;
  }) => Promise<{
    uid: string;
    token: string;
  }>;
  getUserIdByToken: (token: string) => Promise<string>;
  authenticatePassword: (
    email: string,
    password: string,
  ) => Promise<{ uid: string; token: string } | null>;

  generateKeyPair: () => Promise<{
    privateKey: string;
    publicKey: string;
  }>;

  constructor(adapters: { auth: AuthAdapter; crypto: CryptoAdapter }) {
    this.getTokenByUserId = async (userId) =>
      await adapters.auth.getTokenByUserId(userId);

    this.createUser = async ({
      email,
      password,
      preferredUsername,
    }: {
      email: string;
      password?: string;
      preferredUsername: string;
    }) =>
      await adapters.auth.createUser({
        email,
        password,
        preferredUsername,
      });

    this.getUserIdByToken = async (token) =>
      await adapters.auth.getTokenByUserId(token);

    this.authenticatePassword = async (email: string, password: string) =>
      await adapters.auth.authenticatePassword(email, password);

    this.generateKeyPair = async () => await adapters.crypto.generateKeyPair();
  }
}
