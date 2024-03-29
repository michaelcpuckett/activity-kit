"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const utilities_1 = require("@activity-kit/utilities");
const type_utilities_1 = require("@activity-kit/type-utilities");
const core_1 = require("@activity-kit/core");
const respond = async function () {
    try {
        this.res.setHeader('Vary', 'Accept');
        type_utilities_1.assert.exists(this.req.url);
        const query = new URL(this.req.url, utilities_1.LOCAL_DOMAIN).searchParams;
        type_utilities_1.assert.exists(query);
        const resource = query.get('resource');
        type_utilities_1.assert.exists(resource);
        if (!resource.startsWith('acct:')) {
            throw new Error('Not found.');
        }
        const [account, hostname] = resource.split('@');
        const [, username] = account.split(':');
        if (hostname !== utilities_1.LOCAL_HOSTNAME) {
            throw new Error('Not found.');
        }
        const actor = await this.core.findOne('entity', {
            preferredUsername: username,
        }, [core_1.DbOptions.CASE_INSENSITIVE]);
        type_utilities_1.assert.isApActor(actor);
        const actorUrl = actor.url;
        type_utilities_1.assert.exists(actorUrl);
        this.res.statusCode = 200;
        if (this.req.headers.accept?.includes(utilities_1.JSON_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(utilities_1.JRD_CONTENT_TYPE)) {
            const finger = {
                subject: `acct:${actor.preferredUsername}@${utilities_1.LOCAL_HOSTNAME}`,
                aliases: [actorUrl.toString()],
                links: [
                    {
                        rel: 'http://webfinger.net/rel/profile-page',
                        type: utilities_1.HTML_CONTENT_TYPE,
                        href: actorUrl.toString(),
                    },
                    {
                        rel: 'self',
                        type: utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
                        href: actorUrl.toString(),
                    },
                ],
            };
            this.res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.JRD_CONTENT_TYPE);
            this.res.write(JSON.stringify(finger));
        }
        else {
            const finger = `<?xml version="1.0" encoding="UTF-8" ?>
        <XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
          <Subject>acct:${actor.preferredUsername}@${utilities_1.LOCAL_HOSTNAME}</Subject>
          <Alias>${actorUrl.toString()}</Alias>
          <Link
            rel="http://webfinger.net/rel/profile-page"
            type="${utilities_1.HTML_CONTENT_TYPE}"
            href="${actorUrl.toString()}"
          />
          <Link
            rel="self"
            type="${utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE}"
            href="${actorUrl.toString()}"
          />
        </XRD>
      `.trim();
            this.res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.XRD_CONTENT_TYPE);
            this.res.write(finger);
        }
        this.res.end();
    }
    catch (error) {
        this.res.statusCode = 404;
        this.res.end();
    }
};
exports.respond = respond;
//# sourceMappingURL=respond.js.map