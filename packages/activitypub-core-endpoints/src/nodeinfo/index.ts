import type { IncomingMessage, ServerResponse } from 'http';
import {
  CONTENT_TYPE_HEADER,
  JSON_CONTENT_TYPE,
  LOCAL_DOMAIN
} from 'activitypub-core-utilities';
import type { DbAdapter, Plugin } from 'activitypub-core-types';

export class NodeinfoGetEndpoint {
  req: IncomingMessage;
  res: ServerResponse;
  adapters: {
    db: DbAdapter;
  };

  constructor(
    req: IncomingMessage,
    res: ServerResponse,
    adapters: {
      db: DbAdapter;
    },
    plugins: Plugin[]
  ) {
    this.req = req;
    this.res = res;
    this.adapters = adapters;
  }

  public async respond() {
    const url = this.req.url ?? '';
    const version = parseFloat(url.split('nodeinfo/')[1]);
    if (version === 2) {
      this.res.setHeader(CONTENT_TYPE_HEADER, JSON_CONTENT_TYPE);
      this.res.statusCode = 200;  
      this.res.write(JSON.stringify({
        "version": "2.0",
        "openRegistrations": true,
        "protocols": [
          "activitypub"
        ],
        "software": {
          "name": "activitypub-core",
          "version": "0.0.228"
       },
        "services": {
          "inbound": [],
          "outbound": []
        },
        "usage": {
          "users": {}
        },
        "metadata": {}
      }));
    } else if (version === 2.1) {
      this.res.setHeader(CONTENT_TYPE_HEADER, JSON_CONTENT_TYPE);
      this.res.statusCode = 200;
      this.res.write(JSON.stringify({
        "version": "2.1",
        "openRegistrations": true,
        "protocols": [
          "activitypub"
        ],
        "software": {
          "name": "activitypub-core",
          "repository": "https://github.com/michaelcpuckett/activitypub-core",
          "version": "0.0.228"
        },
        "services": {
          "inbound": [],
          "outbound": []
        },
        "usage": {
          "users": {}
        },
        "metadata": {},
      }));
    } else if (!version) {
      this.res.setHeader(CONTENT_TYPE_HEADER, JSON_CONTENT_TYPE);
      this.res.statusCode = 200;  
      this.res.write(JSON.stringify({
        "links": [
           {
              "href": `${LOCAL_DOMAIN}/nodeinfo/2.0.json`,
              "rel": `http://nodeinfo.diaspora.software/ns/schema/2.0`,
           },
           {
              "href": `${LOCAL_DOMAIN}/nodeinfo/2.1.json`,
              "rel": `http://nodeinfo.diaspora.software/ns/schema/2.1`,
           }
        ]
     }));
    } else {
      this.res.statusCode = 404;
    }

    this.res.end();
  }
}

