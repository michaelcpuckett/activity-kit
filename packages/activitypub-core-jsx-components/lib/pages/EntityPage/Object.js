"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectEntity = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const Note_1 = require("./Note");
const react_1 = __importDefault(require("react"));
function ObjectEntity({ object, headingLevel }) {
    if (object.type === activitypub_core_types_1.AP.ExtendedObjectTypes.NOTE) {
        return react_1.default.createElement(Note_1.NoteEntity, { headingLevel: headingLevel, note: object });
    }
    return react_1.default.createElement("div", { className: "card" },
        react_1.default.createElement("span", { role: "heading", "aria-level": headingLevel },
            "A ",
            object.type));
}
exports.ObjectEntity = ObjectEntity;
//# sourceMappingURL=Object.js.map