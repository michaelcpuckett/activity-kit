"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const Welcome_1 = require("./Welcome");
const Sidebar_1 = require("./Sidebar");
const CreateForm_1 = require("./CreateForm");
const react_1 = __importDefault(require("react"));
function HomePage({ actor }) {
    return (react_1.default.createElement("html", null,
        react_1.default.createElement("head", null,
            react_1.default.createElement("link", { rel: "stylesheet", href: "/home.css" })),
        react_1.default.createElement("body", null,
            react_1.default.createElement("div", { className: "root" },
                react_1.default.createElement(Sidebar_1.Sidebar, { actor: actor }),
                react_1.default.createElement("main", null,
                    react_1.default.createElement("div", { className: "two-up" },
                        react_1.default.createElement("div", { className: "card" },
                            react_1.default.createElement(Welcome_1.Welcome, { actor: actor, headingLevel: 1 })),
                        react_1.default.createElement("div", { className: "card" },
                            react_1.default.createElement(CreateForm_1.CreateForm, { headingLevel: 2, actor: actor }))),
                    react_1.default.createElement("textarea", { defaultValue: JSON.stringify(actor) }))))));
}
exports.HomePage = HomePage;
//# sourceMappingURL=index.js.map