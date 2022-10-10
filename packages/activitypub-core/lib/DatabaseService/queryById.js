"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryById = void 0;
async function queryById(id) {
    try {
        return (await this.findEntityById(id)) ?? (await this.fetchEntityById(id));
    }
    catch (error) {
        throw new Error(String(error));
    }
}
exports.queryById = queryById;
//# sourceMappingURL=queryById.js.map