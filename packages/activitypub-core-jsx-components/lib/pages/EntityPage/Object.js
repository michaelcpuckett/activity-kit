"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectEntity = void 0;
const src_1 = require("activitypub-core-types/src");
const Note_1 = require("./Note");
const react_1 = __importDefault(require("react"));
function ObjectEntity({ object }) {
    if (object.type === src_1.AP.ExtendedObjectTypes.NOTE) {
        return react_1.default.createElement(Note_1.NoteEntity, { note: object });
    }
    return react_1.default.createElement("div", { className: "card" },
        react_1.default.createElement("h1", null,
            react_1.default.createElement(react_1.default.Fragment, null,
                "A ",
                object.type)));
}
exports.ObjectEntity = ObjectEntity;
//# sourceMappingURL=Object.js.map