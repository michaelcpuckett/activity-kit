"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataLayer = void 0;
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const findEntityById_1 = require("./findEntityById");
const fetchEntityById_1 = require("./fetchEntityById");
const queryById_1 = require("./queryById");
const expandEntity_1 = require("./expandEntity");
const getPrivateKey_1 = require("./getPrivateKey");
const getCollectionItems_1 = require("./getCollectionItems");
const getPaginatedCollectionItems_1 = require("./getPaginatedCollectionItems");
const expandCollection_1 = require("./expandCollection");
const getActorByUserId_1 = require("./getActorByUserId");
const getStreamByName_1 = require("./getStreamByName");
const broadcast_1 = require("./broadcast");
const getRecipientUrls_1 = require("./getRecipientUrls");
const getRecipientInboxUrls_1 = require("./getRecipientInboxUrls");
const signAndSendToForeignActorInbox_1 = require("./signAndSendToForeignActorInbox");
class DataLayer {
    fetch;
    initializeDb;
    findAll;
    findOne;
    findStringIdByValue;
    findStringValueById;
    insertItem;
    removeItem;
    insertOrderedItem;
    removeOrderedItem;
    saveEntity;
    saveString;
    getGuid;
    getHttpSignature;
    constructor(adapters) {
        this.fetch = adapters.fetch ?? isomorphic_fetch_1.default;
        if (adapters.db.initializeDb) {
            this.initializeDb = async () => await adapters.db.initializeDb?.();
        }
        this.findAll = async (collection, matchingObject) => await adapters.db.findAll(collection, matchingObject);
        this.findOne = async (collection, matchingObject, options) => await adapters.db.findOne(collection, matchingObject, options);
        this.findStringIdByValue = async (dbCollection, value) => await adapters.db.findStringIdByValue(dbCollection, value);
        this.findStringValueById = async (dbCollection, _id) => await adapters.db.findStringValueById(dbCollection, _id);
        this.insertItem = async (path, url) => await adapters.db.insertItem(path, url);
        this.removeItem = async (path, url) => await adapters.db.removeItem(path, url);
        this.insertOrderedItem = async (path, url) => await adapters.db.insertOrderedItem(path, url);
        this.removeOrderedItem = async (path, url) => await adapters.db.removeOrderedItem(path, url);
        this.saveEntity = async (entity) => await adapters.db.saveEntity(entity);
        this.saveString = async (dbCollection, _id, value) => await adapters.db.saveString(dbCollection, _id, value);
        this.getGuid = async () => await adapters.crypto.randomBytes(16);
        this.getHttpSignature = async (foreignTarget, actorId, privateKey, entity) => await adapters.crypto.getHttpSignature(foreignTarget, actorId, privateKey, entity);
    }
    findEntityById = findEntityById_1.findEntityById;
    getActorByUserId = getActorByUserId_1.getActorByUserId;
    getPrivateKey = getPrivateKey_1.getPrivateKey;
    getStreamByName = getStreamByName_1.getStreamByName;
    fetchEntityById = fetchEntityById_1.fetchEntityById;
    queryById = queryById_1.queryById;
    expandEntity = expandEntity_1.expandEntity;
    getCollectionItems = getCollectionItems_1.getCollectionItems;
    getPaginatedCollectionItems = getPaginatedCollectionItems_1.getPaginatedCollectionItems;
    expandCollection = expandCollection_1.expandCollection;
    getRecipientInboxUrls = getRecipientInboxUrls_1.getRecipientInboxUrls;
    getRecipientUrls = getRecipientUrls_1.getRecipientUrls;
    broadcast = broadcast_1.broadcast;
    signAndSendToForeignActorInbox = signAndSendToForeignActorInbox_1.signAndSendToForeignActorInbox;
}
exports.DataLayer = DataLayer;
//# sourceMappingURL=index.js.map