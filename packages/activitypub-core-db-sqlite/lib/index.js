"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SqliteDbAdapter = void 0;
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const initializeDb_1 = require("./initializeDb");
const findOne_1 = require("./findOne");
const findStringValueById_1 = require("./findStringValueById");
const findStringIdByValue_1 = require("./findStringIdByValue");
const saveEntity_1 = require("./saveEntity");
const saveString_1 = require("./saveString");
const insert_1 = require("./insert");
const findAll_1 = require("./findAll");
class SqliteDbAdapter {
    db;
    fetch;
    constructor(db, adapters) {
        this.db = db;
        this.fetch = adapters?.fetch ?? isomorphic_fetch_1.default;
    }
    initializeDb = initializeDb_1.initializeDb;
    findOne = findOne_1.findOne;
    findAll = findAll_1.findAll;
    findStringValueById = findStringValueById_1.findStringValueById;
    findStringIdByValue = findStringIdByValue_1.findStringIdByValue;
    saveEntity = saveEntity_1.saveEntity;
    saveString = saveString_1.saveString;
    insertItem = insert_1.insertItem;
    removeItem = insert_1.removeItem;
    insertOrderedItem = insert_1.insertOrderedItem;
    removeOrderedItem = insert_1.removeOrderedItem;
}
exports.SqliteDbAdapter = SqliteDbAdapter;
//# sourceMappingURL=index.js.map