"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveString = void 0;
const mongodb_1 = require("mongodb");
async function saveString(dbCollection, _id, value) {
    if (!(this.db instanceof mongodb_1.Db)) {
        throw new Error('Bad database.');
    }
    await this.db.collection(dbCollection).replaceOne({
        _id,
    }, JSON.parse(JSON.stringify({
        value,
    })), {
        upsert: true,
    });
}
exports.saveString = saveString;
//# sourceMappingURL=saveString.js.map