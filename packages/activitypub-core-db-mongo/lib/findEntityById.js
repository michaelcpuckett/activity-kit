"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEntityById = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function findEntityById(id) {
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(id);
    if (collectionName === 'foreign-entity') {
        return null;
    }
    return await this.findOne(collectionName, { _id: id.toString() });
}
exports.findEntityById = findEntityById;
//# sourceMappingURL=findEntityById.js.map