"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBody = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function parseBody() {
    const result = await (0, utilities_1.parseStream)(this.req);
    (0, types_1.assertIsApActivity)(result);
    this.activity = result;
}
exports.parseBody = parseBody;
//# sourceMappingURL=parseBody.js.map