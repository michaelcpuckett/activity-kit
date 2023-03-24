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
    const convertedEntity = (0, activitypub_core_utilities_1.cleanProps)((0, activitypub_core_utilities_1.convertUrlsToStrings)((0, activitypub_core_utilities_1.applyContext)(entity)));
    const existingRecord = await this.db.get(`SELECT * from ${collectionName} WHERE _id = ?;`, _id);
    if (existingRecord) {
        return await this.db.run(`UPDATE ${collectionName} WHERE _id = ${_id} VALUES (?);`, convertedEntity);
    }
    else {
        return await this.db.run(`INSERT INTO ${collectionName} VALUES (?);`, {
            _id,
            ...convertedEntity,
        });
    }
}
exports.saveEntity = saveEntity;
//# sourceMappingURL=saveEntity.js.map