import { IncomingMessage } from 'http';

/**
 * Converts an HTTP stream to a string.
 *
 * @returns The string.
 *
 * @todo This is being depricated in favor of having adapters handle this.
 */
export async function streamToString(stream: IncomingMessage): Promise<string> {
  if (stream) {
    const chunks = [];

    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }

    return Buffer.concat(chunks).toString('utf-8');
  }

  return '';
}
