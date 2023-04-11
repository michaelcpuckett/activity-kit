"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getActors() {
    (0, activitypub_core_types_1.assertIsApActivity)(this.activity);
    const recipientIds = [
        ...(this.activity.to
            ? await this.adapters.delivery.getRecipientsList(this.activity.to)
            : []),
        ...(this.activity.cc
            ? await this.adapters.delivery.getRecipientsList(this.activity.cc)
            : []),
        ...(this.activity.bto
            ? await this.adapters.delivery.getRecipientsList(this.activity.bto)
            : []),
        ...(this.activity.bcc
            ? await this.adapters.delivery.getRecipientsList(this.activity.bcc)
            : []),
        ...(this.activity.audience
            ? await this.adapters.delivery.getRecipientsList(this.activity.audience)
            : []),
    ];
    const recipients = await Promise.all(recipientIds.map(async (recipientId) => {
        (0, activitypub_core_types_1.assertIsApActivity)(this.activity);
        if (recipientId.toString() === (0, activitypub_core_utilities_1.getId)(this.activity.actor).toString()) {
            return null;
        }
        const isLocal = (0, activitypub_core_utilities_1.getCollectionNameByUrl)(recipientId) === 'entity';
        if (!isLocal) {
            return null;
        }
        const recipient = await this.adapters.db.findEntityById(recipientId);
        if (!recipient) {
            return null;
        }
        try {
            (0, activitypub_core_types_1.assertIsApActor)(recipient);
            return recipient;
        }
        catch (error) {
            return null;
        }
    }));
    const actors = [];
    for (const recipient of recipients) {
        if (recipient) {
            actors.push(recipient);
        }
    }
    return actors;
}
exports.getActors = getActors;
//# sourceMappingURL=getActors.js.map