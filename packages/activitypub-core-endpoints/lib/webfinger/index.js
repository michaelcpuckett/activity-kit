"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebfingerGetEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
class WebfingerGetEndpoint {
    req;
    res;
    adapters;
    plugins;
    constructor(req, res, adapters, plugins) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
    }
    handleNotFound() {
        this.res.statusCode = 404;
        this.res.end();
    }
    async respond() {
        this.res.setHeader('Vary', 'Accept');
        const query = new URL(this.req.url, activitypub_core_utilities_1.LOCAL_DOMAIN).searchParams;
        const resource = query.get('resource') ?? '';
        if (!resource.startsWith('acct:')) {
            this.handleNotFound();
        }
        const [account] = resource.split('@');
        const [, username] = account.split(':');
        const actor = await this.adapters.db.findOne('entity', {
            preferredUsername: username,
        }, [activitypub_core_types_1.DbOptions.CASE_INSENSITIVE]);
        if (!actor) {
            return this.handleNotFound();
        }
        this.res.statusCode = 200;
        if (this.req.headers.accept?.includes(activitypub_core_utilities_1.JSON_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.JRD_CONTENT_TYPE)) {
            const finger = {
                subject: `acct:${actor.preferredUsername}@${activitypub_core_utilities_1.LOCAL_HOSTNAME}`,
                aliases: [
                    actor.url.toString(),
                ],
                links: [
                    {
                        rel: 'http://webfinger.net/rel/profile-page',
                        type: activitypub_core_utilities_1.HTML_CONTENT_TYPE,
                        href: actor.url.toString(),
                    },
                    {
                        rel: 'self',
                        type: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
                        href: actor.url.toString(),
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
          <Alias>${actor.url.toString()}</Alias>
          <Link
            rel="http://webfinger.net/rel/profile-page"
            type="${activitypub_core_utilities_1.HTML_CONTENT_TYPE}"
            href="${actor.url.toString()}"
          />
          <Link
            rel="self"
            type="${activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE}"
            href="${actor.url.toString()}"
          />
        </XRD>
      `.trim();
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.XRD_CONTENT_TYPE);
            this.res.write(finger);
        }
        this.res.end();
    }
}
exports.WebfingerGetEndpoint = WebfingerGetEndpoint;
//# sourceMappingURL=index.js.map