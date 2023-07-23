"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function parseBody() {
    const activity = await (0, utilities_1.parseStream)(this.req);
    type_utilities_1.assert.isApActivity(activity);
    this.activity = activity;
}
exports.parseBody = parseBody;
//# sourceMappingURL=parseBody.js.map