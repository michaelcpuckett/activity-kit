import { CryptoAuthAdapter } from '.';

const randomBytes = () => {
  const array = new Uint32Array(16);
  const random = crypto.getRandomValues(array);
  return String.fromCharCode(...random);
};

export function getTokenByUserId(
  this: CryptoAuthAdapter,
  userId: string,
): string {
  const token = randomBytes();

  if (!('cookieStore' in this.params)) {
    throw new Error('Error');
  }

  this.params.cookieStore[token] = userId;

  return token;
}
