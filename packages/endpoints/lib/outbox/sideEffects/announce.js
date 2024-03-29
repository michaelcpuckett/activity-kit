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
exports.handleAnnounce = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function handleAnnounce(activity) {
    const actorId = (0, utilities_1.getId)(activity.actor);
    type_utilities_1.assert.exists(actorId);
    const actor = await this.core.queryById(actorId);
    type_utilities_1.assert.isApActor(actor);
    const shared = await this.core.getStreamByName(actor, 'Shared');
    type_utilities_1.assert.isApType(shared, AP.CollectionTypes.ORDERED_COLLECTION);
    const sharedId = (0, utilities_1.getId)(shared);
    type_utilities_1.assert.exists(sharedId);
    const activityId = (0, utilities_1.getId)(activity);
    type_utilities_1.assert.exists(activityId);
    await this.core.insertOrderedItem(sharedId, activityId);
    const objectId = (0, utilities_1.getId)(activity.object);
    type_utilities_1.assert.exists(objectId);
    if ((0, utilities_1.isLocal)(objectId)) {
        const object = await this.core.queryById(objectId);
        type_utilities_1.assert.isApEntity(object);
        if (!('shares' in object)) {
            throw new Error('Object is local, but `shares` is not in this object.');
        }
        const sharesId = (0, utilities_1.getId)(object.shares);
        if (!sharesId) {
            throw new Error('Bad shares collection: no ID.');
        }
        await this.core.insertOrderedItem(sharesId, activityId);
    }
}
exports.handleAnnounce = handleAnnounce;
//# sourceMappingURL=announce.js.map