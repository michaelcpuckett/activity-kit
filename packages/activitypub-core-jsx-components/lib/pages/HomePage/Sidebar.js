"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sidebar = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const react_1 = __importDefault(require("react"));
function Sidebar({ actor }) {
    return (react_1.default.createElement("nav", null,
        react_1.default.createElement("ul", null,
            react_1.default.createElement("li", null,
                react_1.default.createElement("a", { href: '/home' }, "New Post")),
            react_1.default.createElement("li", null,
                react_1.default.createElement("a", { href: (0, activitypub_core_utilities_1.getId)(actor.inbox)?.toString() }, "Inbox")),
            react_1.default.createElement("li", null,
                react_1.default.createElement("a", { href: (0, activitypub_core_utilities_1.getId)(actor.outbox)?.toString() }, "Outbox")),
            react_1.default.createElement("li", null,
                react_1.default.createElement("a", { href: (0, activitypub_core_utilities_1.getId)(actor.following)?.toString() ?? '#' }, "Following")),
            react_1.default.createElement("li", null,
                react_1.default.createElement("a", { href: (0, activitypub_core_utilities_1.getId)(actor.followers)?.toString() ?? '#' }, "Followers")),
            react_1.default.createElement("li", null,
                react_1.default.createElement("a", { href: (0, activitypub_core_utilities_1.getId)(actor.liked)?.toString() ?? '#' }, "Liked")),
            Array.isArray(actor.streams) ? actor.streams.map(stream => {
                if (stream instanceof URL) {
                    return react_1.default.createElement(react_1.default.Fragment, null);
                }
                return (react_1.default.createElement("li", { key: (0, activitypub_core_utilities_1.getId)(stream).toString() },
                    react_1.default.createElement("a", { href: (0, activitypub_core_utilities_1.getId)(stream).toString() ?? '#' }, stream.name)));
            }) : null)));
}
exports.Sidebar = Sidebar;
//# sourceMappingURL=Sidebar.js.map