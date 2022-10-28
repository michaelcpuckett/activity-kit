"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStringValueById = void 0;
async function findStringValueById(dbCollection, _id) {
    const one = await this.db.collection(dbCollection).findOne({ _id });
    if (!one) {
        return '';
    }
    if (!('value' in one) || typeof one.value !== 'string') {
        return '';
    }
    return one.value;
}
exports.findStringValueById = findStringValueById;
//# sourceMappingURL=findStringValueById.js.map