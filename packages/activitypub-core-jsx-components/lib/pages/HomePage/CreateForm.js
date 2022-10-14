"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateForm = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const react_1 = __importDefault(require("react"));
function CreateForm({ actor, headingLevel }) {
    return react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("span", { role: "heading", "aria-level": headingLevel }, "Create"),
        react_1.default.createElement("form", { id: "createForm", action: actor.outbox instanceof URL ? actor.outbox.toString() : actor.outbox?.id?.toString(), noValidate: true },
            react_1.default.createElement("label", null,
                react_1.default.createElement("span", null, "Type"),
                react_1.default.createElement("select", { name: "type", defaultValue: 'Note' }, Object.values(activitypub_core_types_1.AP.ExtendedObjectTypes).map(type => react_1.default.createElement("option", { key: type }, type)))),
            react_1.default.createElement("label", null,
                react_1.default.createElement("span", null, "Summary"),
                react_1.default.createElement("textarea", { name: "summary" })),
            react_1.default.createElement("label", null,
                react_1.default.createElement("span", null, "Content"),
                react_1.default.createElement("textarea", { required: true, name: "content" })),
            react_1.default.createElement("label", null,
                react_1.default.createElement("span", null, "Location"),
                react_1.default.createElement("input", { type: "text", name: "location" })),
            react_1.default.createElement("fieldset", { name: "to" },
                react_1.default.createElement("label", null,
                    react_1.default.createElement("span", null, "Public")),
                react_1.default.createElement("label", null,
                    react_1.default.createElement("span", null, "Followers"),
                    react_1.default.createElement("input", { defaultChecked: true, type: "checkbox", name: "to", value: actor.followers ? actor.followers instanceof URL ? actor.followers.toString() : actor.followers.id?.toString() ?? '' : '' })),
                actor.followers && !(actor.followers instanceof URL) && Array.isArray(actor.followers?.items) ? actor.followers.items.map((follower) => {
                    return (react_1.default.createElement("label", { key: follower instanceof URL ? follower.toString() : follower.id?.toString() ?? '' },
                        react_1.default.createElement("span", null,
                            "@",
                            follower instanceof URL ? follower.toString() : 'preferredUsername' in follower ? follower.preferredUsername : follower.id?.toString()),
                        react_1.default.createElement("input", { type: "checkbox", name: "to", value: follower instanceof URL ? follower.toString() : follower.id?.toString() ?? '' })));
                })
                    : null),
            react_1.default.createElement("button", { type: "submit" }, "Submit")),
        react_1.default.createElement("script", { src: "createForm.js" }));
}
exports.CreateForm = CreateForm;
;
//# sourceMappingURL=CreateForm.js.map