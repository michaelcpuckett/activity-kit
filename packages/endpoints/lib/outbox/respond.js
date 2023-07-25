"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function respond() {
    type_utilities_1.assert.isApEntity(this.body);
    await this.getActor();
    type_utilities_1.assert.isApActor(this.actor);
    if (type_utilities_1.guard.isApActivity(this.body)) {
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
        try {
            await this.runSideEffects();
        }
        catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                json: {
                    error: `${error}`,
                },
            };
        }
    }
    else {
        try {
            this.activity = await this.wrapInActivity(this.body);
            await this.handleCreate(this.activity);
        }
        catch (error) {
            console.error(error);
            return {
                statusCode: 500,
                json: {
                    error: `${error}`,
                },
            };
        }
    }
    type_utilities_1.assert.isApActivity(this.activity);
    const activityId = (0, utilities_1.getId)(this.activity);
    type_utilities_1.assert.exists(activityId);
    await this.saveActivity();
    type_utilities_1.assert.isApActor(this.actor);
    this.core.broadcast(this.activity, this.actor);
    return {
        statusCode: 201,
        location: activityId.href,
    };
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map