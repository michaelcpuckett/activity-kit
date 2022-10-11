"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const express_1 = __importDefault(require("express"));
const activitypub_core_express_middleware_1 = require("activitypub-core-express-middleware");
const activitypub_core_jsx_components_1 = require("activitypub-core-jsx-components");
const server_1 = require("react-dom/server");
const credentials_1 = __importDefault(require("./credentials"));
const app = (0, express_1.default)();
app.use(express_1.default.static('src/static'));
app.use((0, activitypub_core_express_middleware_1.activityPub)({
    renderIndex: async () => {
        return (0, server_1.renderToString)(react_1.default.createElement(activitypub_core_jsx_components_1.IndexPage, null));
    },
    renderEntity: async ({ entity }) => {
        return (0, server_1.renderToString)(react_1.default.createElement(activitypub_core_jsx_components_1.EntityPage, { entity: entity }));
    },
    renderHome: async ({ actor }) => {
        return (0, server_1.renderToString)(react_1.default.createElement(activitypub_core_jsx_components_1.HomePage, { actor: actor }));
    },
}, credentials_1.default));
app.listen(process.env.PORT ?? 3000, () => {
    console.log('Running...');
});
//# sourceMappingURL=index.js.map