"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function respond() {
    const url = this.req.url ?? '';
    const version = parseFloat(url.split('nodeinfo/')[1]);
    if (version === 2) {
        this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JSON_CONTENT_TYPE);
        this.res.statusCode = 200;
        this.res.write(JSON.stringify({
            version: '2.0',
            openRegistrations: true,
            protocols: ['activitypub'],
            software: {
                name: 'activitypub-core',
                version: '0.1.0',
            },
            services: {
                inbound: [],
                outbound: [],
            },
            usage: {
                users: {},
            },
            metadata: {},
        }));
    }
    else if (version === 2.1) {
        this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JSON_CONTENT_TYPE);
        this.res.statusCode = 200;
        this.res.write(JSON.stringify({
            version: '2.1',
            openRegistrations: true,
            protocols: ['activitypub'],
            software: {
                name: 'activitypub-core',
                repository: 'https://github.com/michaelcpuckett/activitypub-core',
                version: '0.1.0',
            },
            services: {
                inbound: [],
                outbound: [],
            },
            usage: {
                users: {},
            },
            metadata: {},
        }));
    }
    else if (!version) {
        this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JSON_CONTENT_TYPE);
        this.res.statusCode = 200;
        this.res.write(JSON.stringify({
            links: [
                {
                    href: `${activitypub_core_utilities_1.LOCAL_DOMAIN}/nodeinfo/2.0`,
                    rel: `http://nodeinfo.diaspora.software/ns/schema/2.0`,
                },
                {
                    href: `${activitypub_core_utilities_1.LOCAL_DOMAIN}/nodeinfo/2.1`,
                    rel: `http://nodeinfo.diaspora.software/ns/schema/2.1`,
                },
            ],
        }));
    }
    else {
        this.res.statusCode = 404;
    }
    this.res.end();
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map