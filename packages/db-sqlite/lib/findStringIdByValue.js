"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStringIdByValue = void 0;
async function findStringIdByValue(dbCollection, value) {
    const one = await this.db.get(`SELECT * FROM ${dbCollection} WHERE value = "${value}";`);
    if (!one) {
        return '';
    }
    if (!('_id' in one) || typeof one._id !== 'string') {
        return '';
    }
    return one._id;
}
exports.findStringIdByValue = findStringIdByValue;
//# sourceMappingURL=findStringIdByValue.js.map