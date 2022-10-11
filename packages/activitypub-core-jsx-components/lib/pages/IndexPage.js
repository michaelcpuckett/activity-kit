"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndexPage = void 0;
const react_1 = __importDefault(require("react"));
const IndexPage = () => (react_1.default.createElement("html", null,
    react_1.default.createElement("head", null,
        react_1.default.createElement("link", { rel: "stylesheet", href: "index.css" })),
    react_1.default.createElement("body", null,
        react_1.default.createElement("main", null,
            react_1.default.createElement("form", { id: "signup", action: "/user" },
                react_1.default.createElement("label", null,
                    react_1.default.createElement("span", null, "Email"),
                    react_1.default.createElement("input", { required: true, type: "text", name: "email" })),
                react_1.default.createElement("label", null,
                    react_1.default.createElement("span", null, "Password"),
                    react_1.default.createElement("input", { required: true, type: "password", name: "password" })),
                react_1.default.createElement("label", null,
                    react_1.default.createElement("span", null, "Name"),
                    react_1.default.createElement("input", { required: true, type: "text", name: "name" })),
                react_1.default.createElement("label", null,
                    react_1.default.createElement("span", null, "Username"),
                    react_1.default.createElement("input", { required: true, type: "text", name: "preferredUsername" })),
                react_1.default.createElement("button", { type: "submit" }, "Sign Up"))),
        react_1.default.createElement("script", { type: "module", src: "index.js" }))));
exports.IndexPage = IndexPage;
//# sourceMappingURL=IndexPage.js.map