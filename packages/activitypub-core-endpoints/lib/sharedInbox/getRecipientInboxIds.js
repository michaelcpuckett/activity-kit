"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientInboxIds = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getRecipientInboxIds() {
    if (!this.activity) {
        throw new Error('No activity.');
    }
    const recipientIds = [
        ...(this.activity.to
            ? await this.deliveryService.getRecipientsList(this.activity.to)
            : []),
        ...(this.activity.cc
            ? await this.deliveryService.getRecipientsList(this.activity.cc)
            : []),
        ...(this.activity.bto
            ? await this.deliveryService.getRecipientsList(this.activity.bto)
            : []),
        ...(this.activity.bcc
            ? await this.deliveryService.getRecipientsList(this.activity.bcc)
            : []),
        ...(this.activity.audience
            ? await this.deliveryService.getRecipientsList(this.activity.audience)
            : []),
    ];
    const recipientInboxes = await Promise.all(recipientIds.map(async (recipientId) => {
        if (recipientId.toString() === (0, activitypub_core_utilities_1.getId)(this.activity.actor).toString()) {
            return null;
        }
        const recipient = await this.databaseService.findEntityById(recipientId);
        if (!recipient) {
            return null;
        }
        if ((0, activitypub_core_utilities_1.isTypeOf)(recipient, activitypub_core_types_1.AP.ActorTypes)) {
            return recipient.inbox;
        }
        return null;
    }));
    const recipientInboxIds = [];
    for (const recipientInbox of recipientInboxes) {
        if (recipientInbox instanceof URL) {
            recipientInboxIds.push(recipientInbox);
        }
    }
    return [...new Set(recipientInboxIds)];
}
exports.getRecipientInboxIds = getRecipientInboxIds;
//# sourceMappingURL=getRecipientInboxIds.js.map