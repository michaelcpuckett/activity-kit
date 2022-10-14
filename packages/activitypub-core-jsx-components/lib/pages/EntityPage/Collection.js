"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionEntity = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const react_1 = __importDefault(require("react"));
const Activity_1 = require("./Activity");
function CollectionEntity({ collection, actor, headingLevel }) {
    const { items } = collection;
    if (!Array.isArray(items)) {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("span", { role: "heading", "aria-level": headingLevel }, collection.name),
        actor && collection.name === 'Following' ? react_1.default.createElement(FollowForm, { headingLevel: headingLevel + 1, actor: actor }) : null,
        Array.isArray(collection.items) ? collection.items.map(item => {
            if (item instanceof URL) {
                return react_1.default.createElement(react_1.default.Fragment, null);
            }
            for (const type of Object.values(activitypub_core_types_1.AP.ActivityTypes)) {
                if (type === item.type) {
                    return react_1.default.createElement(Activity_1.ActivityEntity, { headingLevel: headingLevel + 1, activity: item });
                }
            }
            return react_1.default.createElement("li", { key: item.id.toString() }, item.type);
        }) : null));
}
exports.CollectionEntity = CollectionEntity;
function FollowForm({ actor, headingLevel }) {
    return react_1.default.createElement("div", { className: "card" },
        react_1.default.createElement("span", { role: "heading", "aria-lavel": headingLevel }, "Follow a Friend"),
        react_1.default.createElement("form", { id: "followForm", noValidate: true, action: (0, activitypub_core_utilities_1.getId)(actor.outbox).toString() },
            react_1.default.createElement("input", { type: "hidden", name: "actor", value: (0, activitypub_core_utilities_1.getId)(actor).toString() }),
            react_1.default.createElement("label", null,
                react_1.default.createElement("input", { type: "text", name: "object" })),
            react_1.default.createElement("button", { type: "submit" }, "Follow")),
        react_1.default.createElement("script", { type: "module", src: "/followForm.js" }));
}
//# sourceMappingURL=Collection.js.map