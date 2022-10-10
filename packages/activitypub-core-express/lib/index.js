"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nunjucks_1 = __importDefault(require("nunjucks"));
const index_1 = require("./endpoints/get/index");
const user_1 = require("./endpoints/post/user");
const home_1 = require("./endpoints/get/home");
const app = (0, express_1.default)();
nunjucks_1.default.configure('src/pages', {
    autoescape: true,
    express: app
});
app.get('/home', home_1.handleHomeGetRequest);
app.post('/user', user_1.handleUserPostRequest);
app.get('/', index_1.handleIndexGetRequest);
app.listen(process.env.PORT ?? 3000, () => {
    console.log('Running...');
});
//# sourceMappingURL=index.js.map