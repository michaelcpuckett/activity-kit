import 'jasmine';
import { respond } from '../../src/nodeinfo/respond';
import { actor1 } from '../../test_data';
import { JRD_CONTENT_TYPE, LOCAL_DOMAIN, LOCAL_HOSTNAME, XRD_CONTENT_TYPE } from 'activitypub-core-utilities';

describe('Nodeinfo', () => {
  describe('Respond', () => {
    let written2_0: {version: string;}|null = null;
    let written2_1: {version: string;}|null = null;
    let writtenNodeinfo: { links: Array<{href: string; rel: string;}> }|null = null;

    it('Responds to 2.0', async () => {
      const thisValue = {
        req: {
          url: `${LOCAL_DOMAIN}/nodeinfo/2.0`,
        },
        res: {
          statusCode: 0,
          setHeader(header: string) {

          },
          write(string: string) {
            written2_0 = JSON.parse(string);
          },
          end() {

          }
        },
      };

      await (respond as unknown as () => Promise<void>).call(thisValue);

      expect(written2_0?.version).toBe('2.0');
      expect(thisValue.res.statusCode).toBe(200);
    });

    it('Responds to 2.1', async () => {
      const thisValue = {
        req: {
          url: `${LOCAL_DOMAIN}/nodeinfo/2.1`,
        },
        res: {
          statusCode: 0,
          setHeader(header: string) {

          },
          write(string: string) {
            written2_1 = JSON.parse(string);
          },
          end() {

          }
        },
      };

      await (respond as unknown as () => Promise<void>).call(thisValue);

      expect(written2_1?.version).toBe('2.1');
      expect(thisValue.res.statusCode).toBe(200);
    });

    it('Responds to /nodeinfo', async () => {
      const thisValue = {
        req: {
          url: `${LOCAL_DOMAIN}/nodeinfo`,
        },
        res: {
          statusCode: 0,
          setHeader(header: string) {

          },
          write(string: string) {
            writtenNodeinfo = JSON.parse(string);
          },
          end() {

          }
        },
      };

      await (respond as unknown as () => Promise<void>).call(thisValue);

      expect(Array.isArray(writtenNodeinfo?.links)).toBeTrue();
      expect(thisValue.res.statusCode).toBe(200);
    });
  });
});