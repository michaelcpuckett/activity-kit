"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleFoundEntity = void 0;
const utilities_1 = require("@activity-kit/utilities");
async function handleFoundEntity(entity, render) {
    if (this.returnHtml) {
        const expandedEntity = await this.core.expandEntity(entity);
        return {
            statusCode: 200,
            body: await render({
                entity: expandedEntity,
            }),
        };
    }
    else {
        const json = (0, utilities_1.convertEntityToJson)((0, utilities_1.cleanProps)((0, utilities_1.applyContext)(entity)));
        return {
            statusCode: 200,
            body: JSON.stringify(json),
        };
    }
}
exports.handleFoundEntity = handleFoundEntity;
//# sourceMappingURL=handleFoundEntity.js.map