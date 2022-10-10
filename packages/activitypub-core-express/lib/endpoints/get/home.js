"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHomeGetRequest = void 0;
const activitypub_core_1 = require("activitypub-core");
const credentials_1 = __importDefault(require("../../credentials"));
const handleHomeGetRequest = async (req, res) => {
    const result = await (0, activitypub_core_1.homeGetHandler)({
        req,
        res,
    }, credentials_1.default);
    if (result.redirect) {
        res.writeHead(302, {
            'Location': '/'
        });
        res.end();
        return;
    }
    if (Object.keys(result.props).length) {
        res.statusCode = 200;
        res.render('home.njk', result.props);
        return;
    }
    res.statusCode = 500;
    res.end();
    return;
};
exports.handleHomeGetRequest = handleHomeGetRequest;
//# sourceMappingURL=home.js.map