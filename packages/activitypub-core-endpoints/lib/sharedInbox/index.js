"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedInboxEndpoint = exports.sharedInboxHandler = void 0;
const inbox_1 = require("../inbox");
const saveActivity_1 = require("./saveActivity");
const getRecipientInboxIds_1 = require("./getRecipientInboxIds");
async function sharedInboxHandler(req, res, databaseService, deliveryService) {
    if (req.method === 'POST') {
        return await new SharedInboxEndpoint(req, res, databaseService, deliveryService).handlePost();
    }
}
exports.sharedInboxHandler = sharedInboxHandler;
class SharedInboxEndpoint extends inbox_1.InboxEndpoint {
    getRecipientInboxIds = getRecipientInboxIds_1.getRecipientInboxIds;
    saveActivity = saveActivity_1.saveActivity;
}
exports.SharedInboxEndpoint = SharedInboxEndpoint;
//# sourceMappingURL=index.js.map