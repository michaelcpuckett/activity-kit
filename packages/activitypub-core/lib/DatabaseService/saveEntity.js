"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEntity = void 0;
const cleanProps_1 = require("../utilities/cleanProps");
const compressEntity_1 = require("../utilities/compressEntity");
const convertUrlsToStrings_1 = require("../utilities/convertUrlsToStrings");
const getCollectionNameByUrl_1 = require("../utilities/getCollectionNameByUrl");
async function saveEntity(entity) {
    if (!entity.id) {
        throw new Error('No ID.');
    }
    const collectionName = (0, getCollectionNameByUrl_1.getCollectionNameByUrl)(entity.id);
    const _id = entity.id.toString();
    const convertedEntity = (0, convertUrlsToStrings_1.convertUrlsToStrings)((0, cleanProps_1.cleanProps)((0, compressEntity_1.compressEntity)(entity)));
    return await this.db.collection(collectionName).replaceOne({
        _id,
    }, convertedEntity, {
        upsert: true,
    });
}
exports.saveEntity = saveEntity;
//# sourceMappingURL=saveEntity.js.map