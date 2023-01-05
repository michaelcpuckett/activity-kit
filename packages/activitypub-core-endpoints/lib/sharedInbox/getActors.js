"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActors = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getActors() {
    if (!(0, activitypub_core_utilities_1.isTypeOf)(this.activity, activitypub_core_types_1.AP.ActivityTypes)) {
        throw new Error('Not an activity.');
    }
    const activity = this.activity;
    const recipientIds = [
        ...(activity.to
            ? await this.adapters.delivery.getRecipientsList(activity.to)
            : []),
        ...(activity.cc
            ? await this.adapters.delivery.getRecipientsList(activity.cc)
            : []),
        ...(activity.bto
            ? await this.adapters.delivery.getRecipientsList(activity.bto)
            : []),
        ...(activity.bcc
            ? await this.adapters.delivery.getRecipientsList(activity.bcc)
            : []),
        ...(activity.audience
            ? await this.adapters.delivery.getRecipientsList(activity.audience)
            : []),
    ];
    const recipients = await Promise.all(recipientIds.map(async (recipientId) => {
        if (recipientId.toString() === (0, activitypub_core_utilities_1.getId)(activity.actor).toString()) {
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
        if ((0, activitypub_core_utilities_1.isTypeOf)(recipient, activitypub_core_types_1.AP.ActorTypes)) {
            return recipient;
        }
        return null;
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