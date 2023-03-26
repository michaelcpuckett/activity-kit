import { DeliveryAdapter } from '.';

export async function getPeerInboxUrls(
  this: DeliveryAdapter,
): Promise<Array<URL>> {
  /*return [new URL('https://mastodon.social/inbox')];*/

  const peers = await this.adapters.db.findAll('peer', {});

  if (!peers || !peers.length) {
    return [];
  }

  return peers.map((peer) => {
    const [[domain, sharedInboxUrl]] = Object.entries(peer);
    return new URL(sharedInboxUrl);
  });
}
