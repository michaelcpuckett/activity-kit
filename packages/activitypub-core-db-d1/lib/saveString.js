"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveString = void 0;
async function saveString(dbCollection, _id, value) {
    const existingRecord = await this.db
        .prepare(`SELECT * from ${dbCollection} WHERE _id = ?;`)
        .bind(_id)
        .first();
    if (existingRecord) {
        await this.db
            .prepare(`UPDATE ${dbCollection} SET value = ? WHERE _id = ?;`)
            .bind([value, _id])
            .run();
    }
    else {
        await this.db
            .prepare(`INSERT INTO ${dbCollection} ("_id", "value") VALUES (?, ?);`)
            .bind([_id, value])
            .run();
    }
}
exports.saveString = saveString;
//# sourceMappingURL=saveString.js.map