"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryAdapter = void 0;
const broadcast_1 = require("./broadcast");
const getRecipientInboxUrls_1 = require("./getRecipientInboxUrls");
const getRecipientsList_1 = require("./getRecipientsList");
const isPublic_1 = require("./isPublic");
const getPeerInboxUrls_1 = require("./getPeerInboxUrls");
const signAndSendToForeignActorInbox_1 = require("./signAndSendToForeignActorInbox");
const isomorphic_fetch_1 = __importDefault(require("isomorphic-fetch"));
class DeliveryAdapter {
    adapters;
    constructor(config) {
        this.adapters = {
            ...config.adapters,
            fetch: config.adapters.fetch ?? isomorphic_fetch_1.default,
        };
    }
    signAndSendToForeignActorInbox = signAndSendToForeignActorInbox_1.signAndSendToForeignActorInbox;
    broadcast = broadcast_1.broadcast;
    getRecipientInboxUrls = getRecipientInboxUrls_1.getRecipientInboxUrls;
    getRecipientsList = getRecipientsList_1.getRecipientsList;
    isPublic = isPublic_1.isPublic;
    getPeerInboxUrls = getPeerInboxUrls_1.getPeerInboxUrls;
}
exports.DeliveryAdapter = DeliveryAdapter;
//# sourceMappingURL=index.js.map