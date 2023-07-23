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
exports.getRecipientUrls = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function getRecipientUrls(activity) {
    const mentions = ('object' in activity && 'tag' in activity.object
        ? (0, utilities_1.getArray)(activity.object.tag)
        : []).filter((entity) => {
        try {
            type_utilities_1.assert.isApType(entity, AP.LinkTypes.MENTION);
            return true;
        }
        catch {
            return false;
        }
    });
    const recipients = [
        ...(0, utilities_1.getArray)(activity.to),
        ...(0, utilities_1.getArray)(activity.cc),
        ...(0, utilities_1.getArray)(activity.bto),
        ...(0, utilities_1.getArray)(activity.bcc),
        ...(0, utilities_1.getArray)(activity.audience),
        ...mentions,
    ].flat();
    const recipientIds = recipients
        .map((recipient) => (0, utilities_1.getId)(recipient))
        .filter((recipientUrl) => `${recipientUrl}` !== utilities_1.PUBLIC_ACTOR);
    const actorUrls = (await Promise.all(recipientIds.map(async (recipientId) => {
        const foundRecipient = await this.queryById(recipientId);
        if (!foundRecipient) {
            return [];
        }
        try {
            type_utilities_1.assert.isApActor(foundRecipient);
            const actorUrl = (0, utilities_1.getId)(foundRecipient);
            if (actorUrl instanceof URL) {
                return [actorUrl];
            }
        }
        catch (error) {
        }
        try {
            type_utilities_1.assert.isApCollection(foundRecipient);
            const collectionItems = await this.getPaginatedCollectionItems(foundRecipient);
            console.log([collectionItems]);
            const actorsInCollection = [];
            for (const collectionItem of collectionItems) {
                try {
                    const collectionItemId = (0, utilities_1.getId)(collectionItem);
                    type_utilities_1.assert.exists(collectionItemId);
                    const expandedCollectionItem = await this.queryById(collectionItemId);
                    type_utilities_1.assert.isApActor(expandedCollectionItem);
                    const actorUrl = (0, utilities_1.getId)(expandedCollectionItem);
                    if (actorUrl instanceof URL) {
                        actorsInCollection.push(actorUrl);
                    }
                }
                catch (error) {
                }
            }
            return actorsInCollection;
        }
        catch (error) {
        }
        return [];
    }))).flat();
    return (0, utilities_1.deduplicateUrls)(actorUrls);
}
exports.getRecipientUrls = getRecipientUrls;
//# sourceMappingURL=getRecipientUrls.js.map