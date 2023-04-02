"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.D1DbAdapter = void 0;
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const initializeDb_1 = require("./initializeDb");
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
const getPrivateKey_1 = require("./getPrivateKey");
const getCollectionItems_1 = require("./getCollectionItems");
const expandCollection_1 = require("./expandCollection");
const findAll_1 = require("./findAll");
const getActorByUserId_1 = require("./getActorByUserId");
const getStreamByName_1 = require("./getStreamByName");
class D1DbAdapter {
    db;
    adapters;
    constructor(db, adapters) {
        this.db = db;
        this.adapters = {
            fetch: isomorphic_fetch_1.default,
            ...adapters,
        };
    }
    initializeDb = initializeDb_1.initializeDb;
    findOne = findOne_1.findOne;
    findAll = findAll_1.findAll;
    findEntityById = findEntityById_1.findEntityById;
    findStringValueById = findStringValueById_1.findStringValueById;
    findStringIdByValue = findStringIdByValue_1.findStringIdByValue;
    getPrivateKey = getPrivateKey_1.getPrivateKey;
    getStreamByName = getStreamByName_1.getStreamByName;
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
exports.D1DbAdapter = D1DbAdapter;
//# sourceMappingURL=index.js.map