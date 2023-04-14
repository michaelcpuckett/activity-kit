"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryById = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function queryById(id) {
    return (0, activitypub_core_utilities_1.getCollectionNameByUrl)(id) !== 'foreignEntity'
        ? await this.findEntityById(id)
        : await this.fetchEntityById(id);
}
exports.queryById = queryById;
//# sourceMappingURL=queryById.js.map