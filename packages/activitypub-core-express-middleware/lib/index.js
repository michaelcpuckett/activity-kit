"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPub = void 0;
const activitypub_core_1 = require("activitypub-core");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activityPub = ({ renderIndex, renderHome, renderEntity, }, { serviceAccount, databaseService, deliveryService, }) => async (req, res, next) => {
    if (req.url === '/user' && req.method === 'POST') {
        await (0, activitypub_core_1.userPostHandler)(req, res, serviceAccount, databaseService);
        next();
        return;
    }
    if (req.url.startsWith('/actor/') && req.url.endsWith('/inbox')) {
        await (0, activitypub_core_1.inboxHandler)(req, res, databaseService, deliveryService);
        next();
        return;
    }
    console.log(req.url);
    if (req.url.startsWith('/actor/') && req.url.endsWith('/outbox')) {
        console.log('outboxHandler');
        await (0, activitypub_core_1.outboxHandler)(req, res, databaseService, deliveryService);
        next();
        return;
    }
    if (req.url === '/' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
        res.write(await renderIndex());
        res.end();
        next();
        return;
    }
    if (req.url === '/home' && req.method === 'GET') {
        const result = await (0, activitypub_core_1.homeGetHandler)(req, res, serviceAccount, databaseService);
        if (result.redirect) {
            next();
            return;
        }
        if (result.props) {
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            res.write(await renderHome((0, activitypub_core_utilities_1.convertStringsToUrls)(result.props)));
            res.end();
            next();
            return;
        }
        res.statusCode = 500;
        res.end();
        next();
        return;
    }
    if (req.url.startsWith('/object/') || req.url.startsWith('/actor/') || req.url.startsWith('/activity/')) {
        const result = await (0, activitypub_core_1.entityGetHandler)(req, res, databaseService);
        if (result.props) {
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            res.write(await renderEntity((0, activitypub_core_utilities_1.convertStringsToUrls)(result.props)));
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