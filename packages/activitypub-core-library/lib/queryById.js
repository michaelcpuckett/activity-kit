"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryById = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
async function queryById(id) {
    if ((0, activitypub_core_utilities_1.isLocal)(id)) {
        return await this.findEntityById(id);
    }
    const fetchedEntity = await this.fetchEntityById(id);
    if (!fetchedEntity ||
        (0, activitypub_core_utilities_1.isType)(fetchedEntity, activitypub_core_types_1.AP.ExtendedObjectTypes.TOMBSTONE)) {
        return this.findEntityById(id);
    }
    return null;
}
exports.queryById = queryById;
//# sourceMappingURL=queryById.js.map