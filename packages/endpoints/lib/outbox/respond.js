"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function respond() {
    await this.parseBody();
    (0, types_1.assertExists)(this.activity);
    await this.getActor();
    await this.authenticateActor();
    (0, types_1.assertIsApActor)(this.actor);
    const compileOptions = { encode: encodeURIComponent };
    const type = Array.isArray(this.activity.type)
        ? this.activity.type[0]
        : this.activity.type;
    const activityId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes[type.toLowerCase()], compileOptions)({
        guid: await this.core.getGuid(),
    })}`);
    this.activity.id = activityId;
    if ((0, utilities_1.isTypeOf)(this.activity, types_1.AP.ActivityTypes)) {
        (0, types_1.assertIsApActivity)(this.activity);
        this.activity.url = activityId;
        this.activity = (0, utilities_1.combineAddresses)(this.activity);
        await this.runSideEffects();
    }
    else {
        await this.wrapInActivity();
    }
    (0, types_1.assertIsApActivity)(this.activity);
    (0, types_1.assertExists)(this.activity.id);
    await this.saveActivity();
    (0, types_1.assertIsApActor)(this.actor);
    this.core.broadcast(this.activity, this.actor);
    this.res.statusCode = 201;
    this.res.setHeader('Location', this.activity.id.toString());
    this.res.end();
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map