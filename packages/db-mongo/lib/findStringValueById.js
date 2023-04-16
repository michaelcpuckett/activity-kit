"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStringValueById = void 0;
const mongodb_1 = require("mongodb");
async function findStringValueById(dbCollection, _id) {
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
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