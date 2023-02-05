import { DeliveryAdapter } from '.';

export async function getPeerInboxUrls(
  this: DeliveryAdapter,
): Promise<Array<URL>> {
  const peers = this.adapters.db.findAll('peer', {});
  return peers.map((peer: { [key: string]: string }) => {
    const [[domain, sharedInboxUrl]] = Object.entries(peer);
    return new URL(sharedInboxUrl);
  });
}
