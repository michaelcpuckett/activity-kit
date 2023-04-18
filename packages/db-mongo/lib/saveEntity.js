"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveEntity = void 0;
const mongodb_1 = require("mongodb");
const utilities_1 = require("@activity-kit/utilities");
async function saveEntity(entity) {
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
    if (!entity.id) {
        throw new Error('No ID.');
    }
    const collectionName = (0, utilities_1.getCollectionNameByUrl)(entity.id);
    const _id = entity.id.toString();
    await this.db.collection(collectionName).replaceOne({
        _id,
    }, (0, utilities_1.convertEntityToJson)(entity), {
        upsert: true,
    });
}
exports.saveEntity = saveEntity;
//# sourceMappingURL=saveEntity.js.map