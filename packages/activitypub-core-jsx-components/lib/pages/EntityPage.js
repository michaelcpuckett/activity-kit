"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityPage = void 0;
const react_1 = __importDefault(require("react"));
const EntityPage = ({ entity }) => (react_1.default.createElement("html", null,
    react_1.default.createElement("body", null,
        react_1.default.createElement("main", null,
            "This is: ",
            entity.name,
            "!"))));
exports.EntityPage = EntityPage;
//# sourceMappingURL=EntityPage.js.map