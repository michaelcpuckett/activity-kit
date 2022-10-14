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
        const result = await (0, activitypub_core_1.inboxHandler)(req, res, serviceAccount, databaseService, deliveryService);
        if (result.props && Object.keys(result.props).length) {
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            res.write(await renderEntity((0, activitypub_core_utilities_1.convertStringsToUrls)(result.props)));
            res.end();
        }
        return;
    }
    if (req.url.startsWith('/actor/') && req.url.endsWith('/outbox')) {
        const result = await (0, activitypub_core_1.outboxHandler)(req, res, serviceAccount, databaseService, deliveryService);
        if (result.props && Object.keys(result.props).length && 'entity' in result.props) {
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            res.write(await renderEntity({
                entity: (0, activitypub_core_utilities_1.convertStringsToUrls)(result.props.entity),
                actor: (0, activitypub_core_utilities_1.convertStringsToUrls)(result.props.actor),
            }));
            res.end();
        }
        return;
    }
    if (req.url === '/' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
        res.write(await renderIndex());
        res.end();
        return;
    }
    if (req.url === '/home' && req.method === 'GET') {
        const result = await (0, activitypub_core_1.homeGetHandler)(req, res, serviceAccount, databaseService);
        if (result.redirect) {
            next();
            return;
        }
        if (result.props && Object.keys(result.props).length) {
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            res.write(await renderHome((0, activitypub_core_utilities_1.convertStringsToUrls)(result.props)));
            res.end();
            return;
        }
        res.statusCode = 500;
        res.end();
        return;
    }
    if (req.url.startsWith('/object/') || req.url.startsWith('/actor/') || req.url.startsWith('/activity/')) {
        const result = await (0, activitypub_core_1.entityGetHandler)(req, res, serviceAccount, databaseService);
        if (result.props && Object.keys(result.props).length) {
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            res.write(await renderEntity((0, activitypub_core_utilities_1.convertStringsToUrls)(result.props)));
            res.end();
            return;
        }
        res.statusCode = 500;
        res.end();
        return;
    }
    next();
};
exports.activityPub = activityPub;
//# sourceMappingURL=index.js.map