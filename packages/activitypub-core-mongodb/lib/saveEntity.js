"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEntity = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function saveEntity(entity) {
    if (!entity.id) {
        throw new Error('No ID.');
    }
    const collectionName = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(entity.id);
    const _id = entity.id.toString();
    const convertedEntity = (0, activitypub_core_utilities_1.convertUrlsToStrings)((0, activitypub_core_utilities_1.cleanProps)(entity));
    return await this.db.collection(collectionName).replaceOne({
        _id,
    }, convertedEntity, {
        upsert: true,
    });
}
exports.saveEntity = saveEntity;
//# sourceMappingURL=saveEntity.js.map