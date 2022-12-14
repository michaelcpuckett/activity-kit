"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryGetEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
class DirectoryGetEndpoint {
    req;
    res;
    adapters;
    plugins;
    url;
    constructor(req, res, adapters, plugins, url) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
        this.url = url ?? new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}${req.url}`);
    }
    async respond(render) {
        const groups = await this.adapters.db.findAll('entity', {
            type: 'Group',
        });
        const groupsWithFollowers = await Promise.all(groups.map(async (group) => (0, activitypub_core_utilities_2.convertUrlsToStrings)({
            ...group,
            followers: await this.adapters.db.findEntityById(group.followers),
        })));
        this.res.statusCode = 200;
        this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
        this.res.write(await render({
            groups: groupsWithFollowers,
        }));
        this.res.end();
    }
}
exports.DirectoryGetEndpoint = DirectoryGetEndpoint;
//# sourceMappingURL=index.js.map