"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const react_1 = __importDefault(require("react"));
const HomePage = ({ actor }) => (react_1.default.createElement("html", null,
    react_1.default.createElement("body", null,
        react_1.default.createElement("main", null,
            "Hello ",
            react_1.default.createElement("a", { href: actor.id?.toString() }, actor.preferredUsername),
            "!"))));
exports.HomePage = HomePage;
//# sourceMappingURL=HomePage.js.map