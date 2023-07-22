"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function respond() {
    console.log(this.body);
    (0, types_1.assertIsApEntity)(this.body);
    await this.getActor();
    (0, types_1.assertIsApActor)(this.actor);
    if ((0, types_1.isTypeOf)(this.body, types_1.AP.ActivityTypes)) {
        (0, types_1.assertIsApActivity)(this.body);
        this.activity = this.body;
        const [type] = (0, utilities_1.getArray)(this.activity.type);
        const activityId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes[type.toLowerCase()], {
            encode: encodeURIComponent,
        })({
            guid: await this.core.getGuid(),
        })}`);
        this.activity.id = activityId;
        this.activity.url = activityId;
        this.activity = this.combineAddresses(this.activity);
        await this.runSideEffects();
    }
    else {
        this.activity = await this.wrapInActivity(this.body);
        await this.handleCreate(this.activity);
    }
    (0, types_1.assertIsApActivity)(this.activity);
    (0, types_1.assertExists)(this.activity.id);
    await this.saveActivity();
    (0, types_1.assertIsApActor)(this.actor);
    this.core.broadcast(this.activity, this.actor);
    return {
        statusCode: 201,
        contentType: 'application/activity+json',
        location: this.activity.id.toString(),
    };
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map