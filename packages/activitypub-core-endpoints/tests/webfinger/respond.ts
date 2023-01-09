import 'jasmine';
import { respond } from '../../src/webfinger/respond';
import { actor1 } from '../../test_data';
import { JRD_CONTENT_TYPE, LOCAL_DOMAIN, LOCAL_HOSTNAME, XRD_CONTENT_TYPE } from 'activitypub-core-utilities';

describe('Webfinger', () => {
  describe('Respond', () => {
    let writtenJrdFinger: {subject: string;}|null = null;
    let writtenXrdFinger: string|null = null;

    it('Responds with JRD content-type', async () => {
      await (respond as unknown as () => Promise<void>).call({
        req: {
          headers: {
            accept: [JRD_CONTENT_TYPE],
          },
          url: new URL(`${LOCAL_DOMAIN}/test?resource=acct:${actor1.preferredUsername}@${LOCAL_HOSTNAME}`),
        },
        res: {
          setHeader() {
            
          },
          write(string: string) {
            writtenJrdFinger = JSON.parse(string);
          },
          end() {

          },
        },
        adapters: {
          db: {
            findOne(collectionName: string, {preferredUsername}: {preferredUsername: string}) {
              if (preferredUsername === actor1.preferredUsername) {
                return {
                  ...actor1,
                };
              }
            },
          }
        }
      });

      expect(writtenJrdFinger?.subject).toBe(`acct:${actor1.preferredUsername}@${LOCAL_HOSTNAME}`);
    });

    it('Responds with XRD content-type', async () => {
      await (respond as unknown as () => Promise<void>).call({
        req: {
          headers: {
            accept: [XRD_CONTENT_TYPE],
          },
          url: new URL(`${LOCAL_DOMAIN}/test?resource=acct:${actor1.preferredUsername}@${LOCAL_HOSTNAME}`),
        },
        res: {
          setHeader() {
            
          },
          write(string: string) {
            writtenXrdFinger = string;
          },
          end() {

          },
        },
        adapters: {
          db: {
            findOne(collectionName: string, {preferredUsername}: {preferredUsername: string}) {
              if (preferredUsername === actor1.preferredUsername) {
                return {
                  ...actor1,
                };
              }
            },
          }
        }
      });

      expect(`${writtenXrdFinger}`.slice(0, 5)).toBe(`<?xml`);
    });
  });
});