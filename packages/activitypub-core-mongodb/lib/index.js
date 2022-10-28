"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDatabaseAdapter = exports.MongoDatabase = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const mongodb_1 = require("mongodb");
const findOne_1 = require("./findOne");
const findEntityById_1 = require("./findEntityById");
const findStringValueById_1 = require("./findStringValueById");
const findStringIdByValue_1 = require("./findStringIdByValue");
const saveEntity_1 = require("./saveEntity");
const saveString_1 = require("./saveString");
const insert_1 = require("./insert");
const fetchEntityById_1 = require("./fetchEntityById");
const queryById_1 = require("./queryById");
const expandEntity_1 = require("./expandEntity");
const getCollectionItems_1 = require("./getCollectionItems");
const expandCollection_1 = require("./expandCollection");
const findAll_1 = require("./findAll");
const getActorByUserId_1 = require("./getActorByUserId");
class MongoDatabase {
    db;
    fetch;
    constructor(db, fetchFn) {
        this.db = db;
        this.fetch = fetchFn ?? isomorphic_fetch_1.default;
    }
    findOne = findOne_1.findOne;
    findAll = findAll_1.findAll;
    findEntityById = findEntityById_1.findEntityById;
    findStringValueById = findStringValueById_1.findStringValueById;
    findStringIdByValue = findStringIdByValue_1.findStringIdByValue;
    getActorByUserId = getActorByUserId_1.getActorByUserId;
    saveEntity = saveEntity_1.saveEntity;
    saveString = saveString_1.saveString;
    insertItem = insert_1.insertItem;
    removeItem = insert_1.removeItem;
    insertOrderedItem = insert_1.insertOrderedItem;
    removeOrderedItem = insert_1.removeOrderedItem;
    fetchEntityById = fetchEntityById_1.fetchEntityById;
    queryById = queryById_1.queryById;
    expandEntity = expandEntity_1.expandEntity;
    getCollectionItems = getCollectionItems_1.getCollectionItems;
    expandCollection = expandCollection_1.expandCollection;
}
exports.MongoDatabase = MongoDatabase;
class MongoDatabaseAdapter {
    async connect({ mongoClientUrl, dbName, }) {
        const client = new mongodb_1.MongoClient(mongoClientUrl, {
            minPoolSize: 10,
        });
        await client.connect();
        const db = client.db(dbName ?? activitypub_core_utilities_1.DB_NAME);
        return new MongoDatabase(db, isomorphic_fetch_1.default);
    }
}
exports.MongoDatabaseAdapter = MongoDatabaseAdapter;
//# sourceMappingURL=index.js.map