"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityPage = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const Activity_1 = require("./Activity");
const Actor_1 = require("./Actor");
const Collection_1 = require("./Collection");
const CollectionPage_1 = require("./CollectionPage");
const Link_1 = require("./Link");
const Object_1 = require("./Object");
const OrderedCollection_1 = require("./OrderedCollection");
const OrderedCollectionPage_1 = require("./OrderedCollectionPage");
const head_1 = __importDefault(require("next/head"));
const react_1 = __importDefault(require("react"));
function EntityPage({ entity }) {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(head_1.default, null,
            react_1.default.createElement("title", null, "ActivityWeb"),
            react_1.default.createElement("link", { rel: "icon", href: "/favicon.ico" })),
        react_1.default.createElement(Entity, { entity: entity }),
        react_1.default.createElement("details", null,
            react_1.default.createElement("summary", null, "Raw"),
            react_1.default.createElement("textarea", { defaultValue: JSON.stringify(entity) }))));
}
exports.EntityPage = EntityPage;
function Entity({ entity }) {
    if (entity.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION) {
        return react_1.default.createElement(Collection_1.CollectionEntity, { collection: entity });
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
        return react_1.default.createElement(OrderedCollection_1.OrderedCollectionEntity, { collection: entity });
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE) {
        return react_1.default.createElement(CollectionPage_1.CollectionPageEntity, { collectionPage: entity });
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE) {
        return react_1.default.createElement(OrderedCollectionPage_1.OrderedCollectionPageEntity, { orderedCollectionPage: entity });
    }
    for (const type of Object.values(activitypub_core_types_1.AP.ActivityTypes)) {
        if (entity.type === type) {
            return react_1.default.createElement(Activity_1.ActivityEntity, { activity: entity });
        }
    }
    for (const type of Object.values(activitypub_core_types_1.AP.ActorTypes)) {
        if (entity.type === type) {
            return react_1.default.createElement(Actor_1.ActorEntity, { actor: entity });
        }
    }
    for (const type of Object.values(activitypub_core_types_1.AP.ExtendedObjectTypes)) {
        if (entity.type === type) {
            return react_1.default.createElement(Object_1.ObjectEntity, { object: entity });
        }
    }
    for (const type of Object.values(activitypub_core_types_1.AP.LinkTypes)) {
        if (entity.type === type) {
            return react_1.default.createElement(Link_1.LinkEntity, { link: entity });
        }
    }
    return react_1.default.createElement(react_1.default.Fragment, null, "TODO.");
}
//# sourceMappingURL=index.js.map