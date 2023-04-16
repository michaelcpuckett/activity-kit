"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEntityById = void 0;
const utilities_1 = require("@activity-kit/utilities");
async function findEntityById(id) {
    const collectionName = (0, utilities_1.getCollectionNameByUrl)(id);
    return await this.findOne(collectionName, { id: id.toString() });
}
exports.findEntityById = findEntityById;
//# sourceMappingURL=findEntityById.js.map