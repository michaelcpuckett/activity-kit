"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryById = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function queryById(id) {
    if ((0, activitypub_core_utilities_1.getCollectionNameByUrl)(id) !== 'foreignEntity') {
        return await this.findEntityById(id);
    }
    else {
        return (await this.fetchEntityById(id)) ?? (await this.findEntityById(id));
    }
}
exports.queryById = queryById;
//# sourceMappingURL=queryById.js.map