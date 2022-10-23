"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function parseBody() {
    const activity = await (0, activitypub_core_utilities_1.parseStream)(this.req);
    if (!activity) {
        throw new Error('Bad activity: not found.');
    }
    this.activity = activity;
}
exports.parseBody = parseBody;
//# sourceMappingURL=parseBody.js.map