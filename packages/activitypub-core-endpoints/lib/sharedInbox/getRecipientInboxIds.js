"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientInboxIds = void 0;
async function getRecipientInboxIds() {
    if (!this.activity) {
        throw new Error('No activity.');
    }
    const recipients = [
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
    const recipientInboxes = await Promise.all(recipients.map(async (recipient) => {
        if (!this.actor) {
            throw new Error('No actor.');
        }
        if (recipient.toString() === this.actor.id?.toString()) {
            return null;
        }
        const foundThing = await this.databaseService.findEntityById(recipient);
        if (!foundThing) {
            return null;
        }
        if (typeof foundThing === 'object' &&
            'inbox' in foundThing &&
            foundThing.inbox) {
            return foundThing.inbox;
        }
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