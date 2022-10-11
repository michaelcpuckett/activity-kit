import { IncomingMessage } from 'http';

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
