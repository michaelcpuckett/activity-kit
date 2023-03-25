"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveString = void 0;
async function saveString(dbCollection, _id, value) {
    const existingRecord = await this.db.get(`SELECT * from ${dbCollection} WHERE _id = ?;`, _id);
    if (existingRecord) {
        return await this.db.run(`UPDATE ${dbCollection} SET value = ? WHERE _id = ${_id};`, value);
    }
    else {
        return await this.db.run(`INSERT INTO ${dbCollection} ("_id", "value") VALUES (?, ?);`, Object.values({
            _id,
            value,
        }));
    }
}
exports.saveString = saveString;
//# sourceMappingURL=saveString.js.map