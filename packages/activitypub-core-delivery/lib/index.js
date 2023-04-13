"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryAdapter = void 0;
const broadcast_1 = require("./broadcast");
const getRecipientUrls_1 = require("./getRecipientUrls");
const getRecipientInboxUrls_1 = require("./getRecipientInboxUrls");
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
    getRecipientUrls = getRecipientUrls_1.getRecipientUrls;
}
exports.DeliveryAdapter = DeliveryAdapter;
//# sourceMappingURL=index.js.map