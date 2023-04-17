"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFoundEntity = void 0;
const utilities_1 = require("@activity-kit/utilities");
const utilities_2 = require("@activity-kit/utilities");
async function handleFoundEntity(render, entity, authorizedActor) {
    this.res.statusCode = 200;
    if (this.req.headers.accept?.includes(utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
        this.req.headers.accept?.includes(utilities_1.LINKED_DATA_CONTENT_TYPE) ||
        this.req.headers.accept?.includes(utilities_1.JSON_CONTENT_TYPE)) {
        this.res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
        this.res.write((0, utilities_2.convertEntityToJson)((0, utilities_1.cleanProps)((0, utilities_1.applyContext)(entity))));
    }
    else {
        this.res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.HTML_CONTENT_TYPE);
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
                return [key, (0, utilities_2.convertEntityToJson)(value)];
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