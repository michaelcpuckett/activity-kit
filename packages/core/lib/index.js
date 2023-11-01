"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbOptions = exports.CoreLibrary = void 0;
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
const findEntityById_1 = require("./findEntityById");
const queryById_1 = require("./queryById");
const expandEntity_1 = require("./expandEntity");
const getPaginatedCollectionItems_1 = require("./getPaginatedCollectionItems");
const expandCollection_1 = require("./expandCollection");
const getActorByUserId_1 = require("./getActorByUserId");
const getStreamByName_1 = require("./getStreamByName");
const broadcast_1 = require("./broadcast");
const getRecipientUrls_1 = require("./getRecipientUrls");
class CoreFunctions {
    constructor() {
        // Find.
        this.findEntityById = findEntityById_1.findEntityById;
        this.queryById = queryById_1.queryById;
        this.getActorByUserId = getActorByUserId_1.getActorByUserId;
        this.getStreamByName = getStreamByName_1.getStreamByName;
        // Expand.
        this.expandEntity = expandEntity_1.expandEntity;
        this.getPaginatedCollectionItems = getPaginatedCollectionItems_1.getPaginatedCollectionItems;
        this.expandCollection = expandCollection_1.expandCollection;
        // Server-to-Server.
        this.broadcast = broadcast_1.broadcast;
        this.getRecipientUrls = getRecipientUrls_1.getRecipientUrls;
    }
}
class CoreLibrary extends CoreFunctions {
    constructor(adapters) {
        var _a;
        super();
        this.fetch = (_a = adapters.fetch) !== null && _a !== void 0 ? _a : isomorphic_fetch_1.default;
        if (adapters.db.initializeDb) {
            this.initializeDb = adapters.db.initializeDb.bind(adapters.db);
        }
        this.findAll = adapters.db.findAll.bind(adapters.db);
        this.findOne = adapters.db.findOne.bind(adapters.db);
        this.findStringIdByValue = adapters.db.findStringIdByValue.bind(adapters.db);
        this.findStringValueById = adapters.db.findStringValueById.bind(adapters.db);
        this.insertItem = adapters.db.insertItem.bind(adapters.db);
        this.removeItem = adapters.db.removeItem.bind(adapters.db);
        this.insertOrderedItem = adapters.db.insertOrderedItem.bind(adapters.db);
        this.removeOrderedItem = adapters.db.removeOrderedItem.bind(adapters.db);
        this.saveEntity = adapters.db.saveEntity.bind(adapters.db);
        this.saveString = adapters.db.saveString.bind(adapters.db);
        this.getHttpSignature = adapters.crypto.getHttpSignature.bind(adapters.crypto);
        this.generateKeyPair = adapters.crypto.generateKeyPair.bind(adapters.crypto);
        this.hashPassword = adapters.crypto.hashPassword.bind(adapters.crypto);
        this.randomBytes = adapters.crypto.randomBytes.bind(adapters.crypto);
        this.getGuid = async () => await adapters.crypto.randomBytes(16);
        this.getTokenByUserId = adapters.auth.getTokenByUserId.bind(adapters.auth);
        this.createUser = adapters.auth.createUser.bind(adapters.auth);
        this.getUserIdByToken = adapters.auth.getUserIdByToken.bind(adapters.auth);
        this.authenticatePassword = adapters.auth.authenticatePassword.bind(adapters.auth);
        this.upload = adapters.storage.upload.bind(adapters.storage);
    }
}
exports.CoreLibrary = CoreLibrary;
var adapters_1 = require("./adapters");
Object.defineProperty(exports, "DbOptions", { enumerable: true, get: function () { return adapters_1.DbOptions; } });
//# sourceMappingURL=index.js.map