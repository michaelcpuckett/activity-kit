import { NodeinfoGetEndpoint } from '.';
import * as AP from '@activity-kit/types';
import * as fs from 'fs';
import * as path from 'path';
import {
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  LOCAL_DOMAIN,
} from '@activity-kit/utilities';

export async function respond(this: NodeinfoGetEndpoint) {
  const url = this.req.url ?? '';
  const version = parseFloat(url.split('nodeinfo/')[1]);

  const getTotalUsers = async () => {
    const persons = await this.core.findAll('entity', {
      type: AP.ActorTypes.PERSON,
    });

    const groups = await this.core.findAll('entity', {
      type: AP.ActorTypes.GROUP,
    });

    return persons.length + groups.length;
  };

  const getSoftwareVersion = async () => {
    const packageJson: { version?: number } = await new Promise(
      (resolve, reject) => {
        fs.readFile(
          path.resolve(__dirname, '../../package.json'),
          (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(JSON.parse(data.toString()));
            }
          },
        );
      },
    );

    if (packageJson.version) {
      return `${packageJson.version}`;
    }

    return '';
  };

  if (version === 2) {
    this.res.setHeader(CONTENT_TYPE_HEADER, JSON_CONTENT_TYPE);
    this.res.statusCode = 200;
    this.res.write(
      JSON.stringify({
        version: '2.0',
        openRegistrations: true,
        protocols: ['activitypub'],
        software: {
          name: 'activitypub-core',
          version: await getSoftwareVersion(),
        },
        services: {
          inbound: [],
          outbound: [],
        },
        usage: {
          users: {
            total: await getTotalUsers(),
          },
        },
        metadata: {},
      }),
    );
  } else if (version === 2.1) {
    this.res.setHeader(CONTENT_TYPE_HEADER, JSON_CONTENT_TYPE);
    this.res.statusCode = 200;
    this.res.write(
      JSON.stringify({
        version: '2.1',
        openRegistrations: true,
        protocols: ['activitypub'],
        software: {
          name: 'activitypub-core',
          repository: 'https://github.com/michaelcpuckett/activitypub-core',
          version: await getSoftwareVersion(),
        },
        services: {
          inbound: [],
          outbound: [],
        },
        usage: {
          users: {
            total: await getTotalUsers(),
          },
        },
        metadata: {},
      }),
    );
  } else if (!version) {
    this.res.setHeader(CONTENT_TYPE_HEADER, JSON_CONTENT_TYPE);
    this.res.statusCode = 200;
    this.res.write(
      JSON.stringify({
        links: [
          {
            href: `${LOCAL_DOMAIN}/nodeinfo/2.0`,
            rel: `http://nodeinfo.diaspora.software/ns/schema/2.0`,
          },
          {
            href: `${LOCAL_DOMAIN}/nodeinfo/2.1`,
            rel: `http://nodeinfo.diaspora.software/ns/schema/2.1`,
          },
        ],
      }),
    );
  } else {
    this.res.statusCode = 404;
  }

  this.res.end();
}
