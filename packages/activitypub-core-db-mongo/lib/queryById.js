"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryById = void 0;
async function queryById(id) {
    return await this.findEntityById(id) ?? await this.fetchEntityById(id);
}
exports.queryById = queryById;
//# sourceMappingURL=queryById.js.map