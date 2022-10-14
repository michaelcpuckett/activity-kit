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
const react_1 = __importDefault(require("react"));
const Sidebar_1 = require("../HomePage/Sidebar");
function EntityPage({ entity, actor, }) {
    return (react_1.default.createElement("html", null,
        react_1.default.createElement("head", null,
            react_1.default.createElement("link", { rel: "stylesheet", href: "/home.css" })),
        react_1.default.createElement("body", null,
            react_1.default.createElement("div", { className: "root" },
                react_1.default.createElement(Sidebar_1.Sidebar, { actor: actor }),
                react_1.default.createElement(Entity, { actor: actor, headingLevel: 1, entity: entity }),
                react_1.default.createElement("details", null,
                    react_1.default.createElement("summary", null, "Raw"),
                    react_1.default.createElement("textarea", { defaultValue: JSON.stringify(entity) }))))));
}
exports.EntityPage = EntityPage;
function Entity({ entity, actor, headingLevel }) {
    if (entity.type === activitypub_core_types_1.AP.CollectionTypes.COLLECTION) {
        return react_1.default.createElement(Collection_1.CollectionEntity, { actor: actor, headingLevel: 1, collection: entity });
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION) {
        return react_1.default.createElement(OrderedCollection_1.OrderedCollectionEntity, { headingLevel: 1, collection: entity });
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionPageTypes.COLLECTION_PAGE) {
        return react_1.default.createElement(CollectionPage_1.CollectionPageEntity, { collectionPage: entity });
    }
    if (entity.type === activitypub_core_types_1.AP.CollectionPageTypes.ORDERED_COLLECTION_PAGE) {
        return react_1.default.createElement(OrderedCollectionPage_1.OrderedCollectionPageEntity, { orderedCollectionPage: entity });
    }
    for (const type of Object.values(activitypub_core_types_1.AP.ActivityTypes)) {
        if (entity.type === type) {
            return react_1.default.createElement(Activity_1.ActivityEntity, { headingLevel: 1, activity: entity });
        }
    }
    for (const type of Object.values(activitypub_core_types_1.AP.ActorTypes)) {
        if (entity.type === type) {
            return react_1.default.createElement(Actor_1.ActorEntity, { headingLevel: 1, actor: entity });
        }
    }
    for (const type of Object.values(activitypub_core_types_1.AP.ExtendedObjectTypes)) {
        if (entity.type === type) {
            return react_1.default.createElement(Object_1.ObjectEntity, { headingLevel: 1, object: entity });
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