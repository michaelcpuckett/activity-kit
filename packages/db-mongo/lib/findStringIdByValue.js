"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findStringIdByValue = void 0;
const mongodb_1 = require("mongodb");
async function findStringIdByValue(dbCollection, value) {
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
    const one = await this.db.collection(dbCollection).findOne({ value });
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