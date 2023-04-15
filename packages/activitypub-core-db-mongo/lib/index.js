"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbAdapter = void 0;
const findOne_1 = require("./findOne");
const findAll_1 = require("./findAll");
const findStringValueById_1 = require("./findStringValueById");
const findStringIdByValue_1 = require("./findStringIdByValue");
const saveEntity_1 = require("./saveEntity");
const saveString_1 = require("./saveString");
const insert_1 = require("./insert");
class MongoDbAdapter {
    db;
    constructor(db) {
        this.db = db;
    }
    findOne = findOne_1.findOne;
    findAll = findAll_1.findAll;
    findStringValueById = findStringValueById_1.findStringValueById;
    findStringIdByValue = findStringIdByValue_1.findStringIdByValue;
    saveEntity = saveEntity_1.saveEntity;
    saveString = saveString_1.saveString;
    insertItem = insert_1.insertItem;
    insertOrderedItem = insert_1.insertOrderedItem;
    removeItem = insert_1.removeItem;
    removeOrderedItem = insert_1.removeOrderedItem;
}
exports.MongoDbAdapter = MongoDbAdapter;
//# sourceMappingURL=index.js.map