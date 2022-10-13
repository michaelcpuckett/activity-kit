"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityEntity = void 0;
const react_1 = __importDefault(require("react"));
const Note_1 = require("./Note");
function ActivityEntity({ activity, headingLevel }) {
    const { actor, target } = activity;
    let object = null;
    if ('object' in activity) {
        object = activity.object;
    }
    if (!actor) {
        return react_1.default.createElement(react_1.default.Fragment, null, "Not found.");
    }
    return (react_1.default.createElement("div", { className: "card" },
        react_1.default.createElement("span", { role: "heading", "aria-level": headingLevel }, activity.type),
        object && object.type === 'Note' ? react_1.default.createElement(Note_1.NoteEntity, { headingLevel: headingLevel + 1, note: object }) : null));
}
exports.ActivityEntity = ActivityEntity;
//# sourceMappingURL=Activity.js.map