import { DeliveryAdapter } from '.';

export async function getPeerInboxUrls(
  this: DeliveryAdapter,
): Promise<Array<URL>> {
  /*return [new URL('https://mastodon.social/inbox')];*/

  const peers = await this.adapters.db.findAll('peer', {});

  if (!peers) {
    return [];
  }

  return peers.map((peer: { [key: string]: string }) => {
    const [[domain, sharedInboxUrl]] = Object.entries(peer);
    return new URL(sharedInboxUrl);
  });
}
