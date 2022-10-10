"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEntityById = void 0;
const getCollectionNameByUrl_1 = require("../utilities/getCollectionNameByUrl");
async function findEntityById(id) {
    const collectionName = (0, getCollectionNameByUrl_1.getCollectionNameByUrl)(id);
    if (collectionName === 'foreign-object') {
        return null;
    }
    return await this.findOne(collectionName, { _id: id.toString() });
}
exports.findEntityById = findEntityById;
//# sourceMappingURL=findEntityById.js.map