"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryById = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function queryById(id) {
    if ((0, utilities_1.isLocal)(id)) {
        return await this.findEntityById(id);
    }
    const fetchedEntity = await this.fetchEntityById(id);
    if (!fetchedEntity ||
        (0, types_1.isType)(fetchedEntity, types_1.AP.ExtendedObjectTypes.TOMBSTONE)) {
        return this.findEntityById(id);
    }
    return fetchedEntity;
}
exports.queryById = queryById;
//# sourceMappingURL=queryById.js.map