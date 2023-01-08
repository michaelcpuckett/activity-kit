"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityGetEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
const respond_1 = require("./respond");
class EntityGetEndpoint {
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
    handleBadRequest() {
        this.res.statusCode = 500;
        this.res.write('Bad request');
        this.res.end();
        return {
            props: {},
        };
    }
    async handleFoundEntity(render, entity, authorizedActor) {
        this.res.statusCode = 200;
        if (this.req.headers.accept?.includes(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.LINKED_DATA_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.JSON_CONTENT_TYPE)) {
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
            this.res.write((0, activitypub_core_utilities_3.stringify)(entity));
        }
        else {
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            let props = {
                entity,
                actor: authorizedActor,
            };
            if (this.plugins) {
                for (const plugin of this.plugins) {
                    if ('getEntityPageProps' in plugin && plugin.getEntityPageProps) {
                        props = {
                            ...props,
                            ...(await plugin.getEntityPageProps(entity)),
                        };
                    }
                }
            }
            const formattedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => {
                if (typeof value === 'object') {
                    return [key, (0, activitypub_core_utilities_2.convertUrlsToStrings)(value)];
                }
                else {
                    return [key, value];
                }
            }));
            this.res.write(await render(formattedProps));
        }
        this.res.end();
    }
    handleNotFound() {
        this.res.statusCode = 404;
        this.res.write('Not found');
        this.res.end();
        return {
            props: {},
        };
    }
    respond = respond_1.respond;
}
exports.EntityGetEndpoint = EntityGetEndpoint;
//# sourceMappingURL=index.js.map