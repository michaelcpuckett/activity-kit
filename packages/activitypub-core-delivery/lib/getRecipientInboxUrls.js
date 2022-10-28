"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecipientInboxUrls = void 0;
async function getRecipientInboxUrls(activity, actor) {
    const recipients = [
        ...(activity.to ? await this.getRecipientsList(activity.to) : []),
        ...(activity.cc ? await this.getRecipientsList(activity.cc) : []),
        ...(activity.bto ? await this.getRecipientsList(activity.bto) : []),
        ...(activity.bcc ? await this.getRecipientsList(activity.bcc) : []),
        ...(activity.audience
            ? await this.getRecipientsList(activity.audience)
            : []),
    ];
    const recipientInboxes = await Promise.all(recipients.map(async (recipient) => {
        if (recipient.toString() === actor.id?.toString()) {
            return null;
        }
        const foundThing = await this.adapters.db.queryById(recipient);
        if (!foundThing) {
            return null;
        }
        if (typeof foundThing === 'object' &&
            'inbox' in foundThing &&
            foundThing.inbox) {
            if (foundThing.endpoints) {
                if (foundThing.endpoints.sharedInbox instanceof URL) {
                    return foundThing.endpoints.sharedInbox;
                }
            }
            if (foundThing.inbox instanceof URL) {
                return foundThing.inbox;
            }
            return foundThing.inbox.id;
        }
    }));
    const recipientInboxUrls = [];
    for (const recipientInbox of recipientInboxes) {
        if (recipientInbox instanceof URL) {
            recipientInboxUrls.push(recipientInbox);
        }
    }
    return [...new Set(recipientInboxUrls)];
}
exports.getRecipientInboxUrls = getRecipientInboxUrls;
//# sourceMappingURL=getRecipientInboxUrls.js.map