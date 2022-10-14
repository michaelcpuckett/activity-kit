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
const activitypub_core_mongodb_1 = require("activitypub-core-mongodb");
const activitypub_core_delivery_1 = require("activitypub-core-delivery");
(async () => {
    const app = (0, express_1.default)();
    const databaseService = await new activitypub_core_mongodb_1.MongoDatabaseService().connect();
    const deliveryService = new activitypub_core_delivery_1.DeliveryService(databaseService);
    app.use(express_1.default.static('node_modules/activitypub-core-jsx-components/static'));
    app.use((0, activitypub_core_express_middleware_1.activityPub)({
        renderIndex: async () => {
            return `<!doctype html>${(0, server_1.renderToString)(react_1.default.createElement(activitypub_core_jsx_components_1.IndexPage, null))}`;
        },
        renderEntity: async ({ entity }) => {
            return `<!doctype html>${(0, server_1.renderToString)(react_1.default.createElement(activitypub_core_jsx_components_1.EntityPage, { entity: entity }))}`;
        },
        renderHome: async ({ actor }) => {
            return `<!doctype html>${(0, server_1.renderToString)(react_1.default.createElement(activitypub_core_jsx_components_1.HomePage, { actor: actor }))}`;
        },
    }, {
        databaseService,
        deliveryService,
        serviceAccount: credentials_1.default
    }));
    app.listen(process.env.PORT ?? 3000, () => {
        console.log('Running...');
    });
})();
//# sourceMappingURL=index.js.map