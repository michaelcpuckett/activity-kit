"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
const respond = async function () {
    try {
        this.res.setHeader('Vary', 'Accept');
        (0, activitypub_core_types_1.assertExists)(this.req.url);
        const query = new URL(this.req.url, activitypub_core_utilities_1.LOCAL_DOMAIN).searchParams;
        (0, activitypub_core_types_1.assertExists)(query);
        const resource = query.get('resource');
        (0, activitypub_core_types_1.assertExists)(resource);
        if (!resource.startsWith('acct:')) {
            throw new Error('Not found.');
        }
        const [account, hostname] = resource.split('@');
        const [, username] = account.split(':');
        if (hostname !== activitypub_core_utilities_1.LOCAL_HOSTNAME) {
            throw new Error('Not found.');
        }
        const actor = await this.adapters.db.findOne('entity', {
            preferredUsername: username,
        }, [activitypub_core_types_1.DbOptions.CASE_INSENSITIVE]);
        (0, activitypub_core_types_1.assertIsApActor)(actor);
        const actorUrl = actor.url;
        (0, activitypub_core_types_1.assertExists)(actorUrl);
        this.res.statusCode = 200;
        if (this.req.headers.accept?.includes(activitypub_core_utilities_1.JSON_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.JRD_CONTENT_TYPE)) {
            const finger = {
                subject: `acct:${actor.preferredUsername}@${activitypub_core_utilities_1.LOCAL_HOSTNAME}`,
                aliases: [
                    actorUrl.toString(),
                ],
                links: [
                    {
                        rel: 'http://webfinger.net/rel/profile-page',
                        type: activitypub_core_utilities_1.HTML_CONTENT_TYPE,
                        href: actorUrl.toString(),
                    },
                    {
                        rel: 'self',
                        type: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
                        href: actorUrl.toString(),
                    },
                ],
            };
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JRD_CONTENT_TYPE);
            this.res.write(JSON.stringify(finger));
        }
        else {
            const finger = `
        <?xml version="1.0" encoding="UTF-8" ?>
        <XRD xmlns="http://docs.oasis-open.org/ns/xri/xrd-1.0">
          <Subject>acct:${actor.preferredUsername}@${activitypub_core_utilities_1.LOCAL_HOSTNAME}</Subject>
          <Alias>${actorUrl.toString()}</Alias>
          <Link
            rel="http://webfinger.net/rel/profile-page"
            type="${activitypub_core_utilities_1.HTML_CONTENT_TYPE}"
            href="${actorUrl.toString()}"
          />
          <Link
            rel="self"
            type="${activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE}"
            href="${actorUrl.toString()}"
          />
        </XRD>
      `.trim();
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.XRD_CONTENT_TYPE);
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