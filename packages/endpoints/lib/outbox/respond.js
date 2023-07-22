"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const path_to_regexp_1 = require("path-to-regexp");
async function respond() {
    (0, type_utilities_1.assertIsApEntity)(this.body);
    await this.getActor();
    (0, type_utilities_1.assertIsApActor)(this.actor);
    if ((0, type_utilities_1.isTypeOf)(this.body, AP.ActivityTypes)) {
        (0, type_utilities_1.assertIsApActivity)(this.body);
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
    (0, type_utilities_1.assertIsApActivity)(this.activity);
    (0, type_utilities_1.assertExists)(this.activity.id);
    await this.saveActivity();
    (0, type_utilities_1.assertIsApActor)(this.actor);
    this.core.broadcast(this.activity, this.actor);
    return {
        statusCode: 201,
        contentType: 'application/activity+json',
        location: this.activity.id.toString(),
    };
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map