"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPub = void 0;
const activitypub_core_1 = require("activitypub-core");
const activityPub = ({ renderIndex, renderHome, renderEntity, }, serviceAccount) => async (req, res, next) => {
    if (req.url === '/user' && req.method === 'POST') {
        await (0, activitypub_core_1.userPostHandler)(req, res, serviceAccount);
        next();
        return;
    }
    if (req.url === '/' && req.method === 'GET') {
        res.statusCode = 200;
        res.write(await renderIndex());
        res.end();
        next();
        return;
    }
    if (req.url === '/home' && req.method === 'GET') {
        const result = await (0, activitypub_core_1.homeGetHandler)(req, res, serviceAccount);
        if (result.redirect) {
            next();
            return;
        }
        if (result.props) {
            res.statusCode = 200;
            res.write(await renderHome(result.props));
            res.end();
            next();
            return;
        }
        res.statusCode = 500;
        res.end();
        next();
        return;
    }
    if (req.url.startsWith('/object/') || req.url.startsWith('/actor/') || req.url.startsWith('/activity')) {
        const result = await (0, activitypub_core_1.entityGetHandler)(req, res);
        if (result.props) {
            res.statusCode = 200;
            res.write(await renderEntity(result.props));
            res.end();
            next();
            return;
        }
        res.statusCode = 500;
        res.end();
        next();
        return;
    }
    next();
};
exports.activityPub = activityPub;
//# sourceMappingURL=index.js.map