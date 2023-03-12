"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFoundEntity = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const activitypub_core_utilities_3 = require("activitypub-core-utilities");
async function handleFoundEntity(render, entity, authorizedActor) {
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
                        ...(await plugin.getEntityPageProps.call(this, entity)),
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
exports.handleFoundEntity = handleFoundEntity;
//# sourceMappingURL=handleFoundEntity.js.map