"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionNameByUrl = void 0;
const globals_1 = require("./globals");
/**
 * Gets the database collection name for a given URL.
 *
 * Currently, all entities are stored in one of two collections:
 *
 * - `entity` for local entities
 * - `foreignEntity` for foreign/remote entities
 *
 * @returns The collection name.
 */
const getCollectionNameByUrl = (url) => {
    const isLocal = url.hostname === globals_1.LOCAL_HOSTNAME;
    if (!isLocal) {
        return 'foreignEntity';
    }
    return 'entity';
};
exports.getCollectionNameByUrl = getCollectionNameByUrl;
//# sourceMappingURL=getCollectionNameByUrl.js.map