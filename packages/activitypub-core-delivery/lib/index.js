"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryService = void 0;
const broadcast_1 = require("./broadcast");
const getPrivateKey_1 = require("./getPrivateKey");
const getRecipientInboxUrls_1 = require("./getRecipientInboxUrls");
const getRecipientsList_1 = require("./getRecipientsList");
const signAndSendToForeignActorInbox_1 = require("./signAndSendToForeignActorInbox");
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
class DeliveryService {
    databaseService;
    fetch;
    constructor(databaseService, fetchFn) {
        this.databaseService = databaseService;
        this.fetch = fetchFn ?? isomorphic_fetch_1.default;
    }
    getPrivateKey = getPrivateKey_1.getPrivateKey;
    signAndSendToForeignActorInbox = signAndSendToForeignActorInbox_1.signAndSendToForeignActorInbox;
    broadcast = broadcast_1.broadcast;
    getRecipientInboxUrls = getRecipientInboxUrls_1.getRecipientInboxUrls;
    getRecipientsList = getRecipientsList_1.getRecipientsList;
}
exports.DeliveryService = DeliveryService;
//# sourceMappingURL=index.js.map