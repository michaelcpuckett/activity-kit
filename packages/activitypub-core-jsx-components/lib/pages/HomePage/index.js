"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomePage = void 0;
const Welcome_1 = require("./Welcome");
const CreateForm_1 = require("./CreateForm");
const OrderedCollection_1 = require("../EntityPage/OrderedCollection");
const Collection_1 = require("../EntityPage/Collection");
const react_1 = __importDefault(require("react"));
function HomePage({ actor }) {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("main", null,
            react_1.default.createElement("div", { className: "two-up" },
                react_1.default.createElement("div", { className: "card" },
                    react_1.default.createElement(Welcome_1.Welcome, { actor: actor })),
                react_1.default.createElement("div", { className: "card" },
                    react_1.default.createElement(CreateForm_1.CreateForm, { actor: actor }))),
            react_1.default.createElement("div", { className: "two-up" },
                react_1.default.createElement("div", { className: "card" },
                    react_1.default.createElement(OrderedCollection_1.OrderedCollectionEntity, { collection: actor.inbox })),
                react_1.default.createElement("div", { className: "card" },
                    react_1.default.createElement(OrderedCollection_1.OrderedCollectionEntity, { collection: actor.outbox }))),
            react_1.default.createElement("div", { className: "two-up" },
                react_1.default.createElement("div", { className: "card" },
                    react_1.default.createElement(Collection_1.CollectionEntity, { collection: actor.following })),
                react_1.default.createElement("div", { className: "card" },
                    react_1.default.createElement(Collection_1.CollectionEntity, { collection: actor.followers }))),
            react_1.default.createElement("textarea", { defaultValue: JSON.stringify(actor) }))));
}
exports.HomePage = HomePage;
//# sourceMappingURL=index.js.map