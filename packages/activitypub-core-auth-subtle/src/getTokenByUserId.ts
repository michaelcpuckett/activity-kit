import { SubtleAuthAdapter } from '.';

const randomBytes = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export function getTokenByUserId(
  this: SubtleAuthAdapter,
  userId: string,
): string {
  const token = randomBytes(16);

  if (!('cookieStore' in this.params)) {
    throw new Error('Error');
  }

  this.params.cookieStore[token] = userId;

  return token;
}
