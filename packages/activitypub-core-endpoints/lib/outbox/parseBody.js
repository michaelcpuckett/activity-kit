"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function parseBody() {
    const result = await (0, activitypub_core_utilities_1.parseStream)(this.req);
    if (!result) {
        throw new Error('Bad request: Could not parse stream.');
    }
    this.activity = result;
}
exports.parseBody = parseBody;
//# sourceMappingURL=parseBody.js.map