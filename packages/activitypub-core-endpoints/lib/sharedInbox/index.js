"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedInboxPostEndpoint = void 0;
const inbox_1 = require("../inbox");
const getActor_1 = require("./getActor");
const broadcastActivity_1 = require("./broadcastActivity");
const saveActivity_1 = require("./saveActivity");
const getRecipientInboxIds_1 = require("./getRecipientInboxIds");
class SharedInboxPostEndpoint extends inbox_1.InboxPostEndpoint {
    getRecipientInboxIds = getRecipientInboxIds_1.getRecipientInboxIds;
    getActor = getActor_1.getActor;
    broadcastActivity = broadcastActivity_1.broadcastActivity;
    saveActivity = saveActivity_1.saveActivity;
}
exports.SharedInboxPostEndpoint = SharedInboxPostEndpoint;
//# sourceMappingURL=index.js.map