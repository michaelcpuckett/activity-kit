"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderedCollectionEntity = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const react_1 = __importDefault(require("react"));
const Activity_1 = require("./Activity");
const Actor_1 = require("./Actor");
const Link_1 = require("./Link");
const Object_1 = require("./Object");
function OrderedCollectionEntity({ collection, headingLevel }) {
    const { orderedItems: items } = collection;
    if (!Array.isArray(items)) {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    return (react_1.default.createElement("div", { className: "card" },
        react_1.default.createElement("span", { role: "heading", "aria-level": headingLevel }, collection.name),
        Array.isArray(collection.orderedItems) ? collection.orderedItems.map(item => {
            if (item instanceof URL) {
                return react_1.default.createElement(react_1.default.Fragment, null);
            }
            for (const type of Object.values(activitypub_core_types_1.AP.ActivityTypes)) {
                if (item.type === type) {
                    return react_1.default.createElement(Activity_1.ActivityEntity, { headingLevel: headingLevel + 1, activity: item });
                }
            }
            for (const type of Object.values(activitypub_core_types_1.AP.ActorTypes)) {
                if (item.type === type) {
                    return react_1.default.createElement(Actor_1.ActorEntity, { headingLevel: headingLevel + 1, actor: item });
                }
            }
            for (const type of Object.values(activitypub_core_types_1.AP.ExtendedObjectTypes)) {
                if (item.type === type) {
                    return react_1.default.createElement(Object_1.ObjectEntity, { headingLevel: headingLevel + 1, object: item });
                }
            }
            for (const type of Object.values(activitypub_core_types_1.AP.LinkTypes)) {
                if (item.type === type) {
                    return react_1.default.createElement(Link_1.LinkEntity, { link: item });
                }
            }
            return react_1.default.createElement("li", { key: item.id.toString() }, item.type);
        }) : null));
}
exports.OrderedCollectionEntity = OrderedCollectionEntity;
//# sourceMappingURL=OrderedCollection.js.map