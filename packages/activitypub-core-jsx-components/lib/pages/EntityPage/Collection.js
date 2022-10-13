"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollectionEntity = void 0;
const react_1 = __importDefault(require("react"));
function CollectionEntity({ collection, headingLevel }) {
    const { items } = collection;
    if (!Array.isArray(items)) {
        return react_1.default.createElement(react_1.default.Fragment, null);
    }
    return (react_1.default.createElement("div", null,
        react_1.default.createElement("span", { role: "heading", "aria-level": headingLevel }, collection.name)));
}
exports.CollectionEntity = CollectionEntity;
//# sourceMappingURL=Collection.js.map