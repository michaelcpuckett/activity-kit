"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findEntityById = void 0;
const utilities_1 = require("@activity-kit/utilities");
/**
 * Finds an Entity by its ID, which is a URL.
 *
 * @returns The Entity, or null if not found.
 */
async function findEntityById(id) {
    const collectionName = (0, utilities_1.getCollectionNameByUrl)(id);
    return await this.findOne(collectionName, { id: id.href });
}
exports.findEntityById = findEntityById;
//# sourceMappingURL=findEntityById.js.map