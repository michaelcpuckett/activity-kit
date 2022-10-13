"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoteEntity = void 0;
const react_1 = __importDefault(require("react"));
function NoteEntity({ note, headingLevel }) {
    return react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "card" },
            react_1.default.createElement("span", { role: "heading", "aria-level": headingLevel }, note.summary ?? 'A post'),
            react_1.default.createElement("blockquote", null, note.content),
            react_1.default.createElement("dl", null,
                react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement("dt", null, "By"),
                    react_1.default.createElement("dd", null, note.attributedTo && !(note.attributedTo instanceof URL) && !Array.isArray(note.attributedTo) ? note.attributedTo.name : null),
                    react_1.default.createElement("dt", null, "Published"),
                    react_1.default.createElement("dd", null, note.published ? note.published.toDateString() : ''),
                    react_1.default.createElement("dt", null, "Updated"),
                    react_1.default.createElement("dd", null, note.updated ? note.updated.toDateString() : ''),
                    react_1.default.createElement("dt", null, "Location"),
                    react_1.default.createElement("dd", null,
                        react_1.default.createElement(react_1.default.Fragment, null, note.location ? JSON.stringify(note.location) : ''))))));
}
exports.NoteEntity = NoteEntity;
//# sourceMappingURL=Note.js.map