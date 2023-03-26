"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveString = void 0;
async function saveString(dbCollection, _id, value) {
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