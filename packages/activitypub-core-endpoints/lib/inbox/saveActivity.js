"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveActivity = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function saveActivity() {
    await this.adapters.db.saveEntity(this.activity);
    if (this.activity?.id) {
        const inboxId = `${activitypub_core_utilities_1.LOCAL_DOMAIN}${this.req.url}`;
        await this.adapters.db.insertOrderedItem(inboxId, this.activity.id);
    }
}
exports.saveActivity = saveActivity;
//# sourceMappingURL=saveActivity.js.map