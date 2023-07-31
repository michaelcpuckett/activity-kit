"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbOptions = exports.Core = void 0;
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
class Core {
    constructor(adapters) {
        var _a;
        this.findEntityById = findEntityById_1.findEntityById;
        this.getActorByUserId = getActorByUserId_1.getActorByUserId;
        this.getPrivateKey = getPrivateKey_1.getPrivateKey;
        this.getStreamByName = getStreamByName_1.getStreamByName;
        this.fetchEntityById = fetchEntityById_1.fetchEntityById;
        this.queryById = queryById_1.queryById;
        this.expandEntity = expandEntity_1.expandEntity;
        this.getCollectionItems = getCollectionItems_1.getCollectionItems;
        this.getPaginatedCollectionItems = getPaginatedCollectionItems_1.getPaginatedCollectionItems;
        this.expandCollection = expandCollection_1.expandCollection;
        this.broadcast = broadcast_1.broadcast;
        this.getRecipientUrls = getRecipientUrls_1.getRecipientUrls;
        this.fetch = (_a = adapters.fetch) !== null && _a !== void 0 ? _a : isomorphic_fetch_1.default;
        if (adapters.db.initializeDb) {
            this.initializeDb = async () => { var _a, _b; return await ((_b = (_a = adapters.db).initializeDb) === null || _b === void 0 ? void 0 : _b.call(_a)); };
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
        this.getHttpSignature = async (foreignTarget, actorId, privateKey, entity) => await adapters.crypto.getHttpSignature(foreignTarget, actorId, privateKey, entity);
        this.generateKeyPair = async () => await adapters.crypto.generateKeyPair();
        this.hashPassword = async (password, salt) => await adapters.crypto.hashPassword(password, salt);
        this.randomBytes = async (numberOfBytes) => await adapters.crypto.randomBytes(numberOfBytes);
        this.getGuid = async () => await adapters.crypto.randomBytes(16);
        this.getTokenByUserId = async (userId) => await adapters.auth.getTokenByUserId(userId);
        this.createUser = async ({ email, password, preferredUsername, }) => await adapters.auth.createUser({
            email,
            password,
            preferredUsername,
        });
        this.getUserIdByToken = async (token) => await adapters.auth.getUserIdByToken(token);
        this.authenticatePassword = async (email, password) => await adapters.auth.authenticatePassword(email, password);
        this.upload = async (file) => await adapters.storage.upload(file);
    }
}
exports.Core = Core;
var adapters_1 = require("./adapters");
Object.defineProperty(exports, "DbOptions", { enumerable: true, get: function () { return adapters_1.DbOptions; } });
//# sourceMappingURL=index.js.map