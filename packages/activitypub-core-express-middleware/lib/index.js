"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPub = void 0;
const activitypub_core_endpoints_1 = require("activitypub-core-endpoints");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activityPub = ({ renderLogin, renderHome, renderEntity, }, { authenticationService, databaseService, deliveryService, }) => async (req, res, next) => {
    console.log('INCOMING:', req.url, 'FROM:', req.headers.referer);
    if (req.url === '/user' && req.method === 'POST') {
        await (0, activitypub_core_endpoints_1.userPostHandler)(req, res, authenticationService, databaseService);
        next();
        return;
    }
    if (req.url.startsWith('/.well-known/webfinger')) {
        await (0, activitypub_core_endpoints_1.webfingerHandler)(req, res, databaseService);
        next();
        return;
    }
    if (req.url === '/sharedInbox' && req.method === 'POST') {
        await (0, activitypub_core_endpoints_1.sharedInboxHandler)(req, res, databaseService, deliveryService);
        next();
        return;
    }
    if (req.url.startsWith('/actor/') && req.url.endsWith('/inbox')) {
        const result = await (0, activitypub_core_endpoints_1.inboxHandler)(req, res, authenticationService, databaseService, deliveryService);
        if (result.props && Object.keys(result.props).length) {
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            res.write(await renderEntity((0, activitypub_core_utilities_1.convertStringsToUrls)(result.props)));
            res.end();
        }
        return;
    }
    if (req.url.startsWith('/actor/') && req.url.endsWith('/uploadMedia')) {
        await (0, activitypub_core_endpoints_1.uploadMediaHandler)(req, res, authenticationService, databaseService);
        next();
        return;
    }
    if (req.url.startsWith('/actor/') && req.url.endsWith('/outbox')) {
        const result = await (0, activitypub_core_endpoints_1.outboxHandler)(req, res, authenticationService, databaseService, deliveryService);
        if (result.props &&
            Object.keys(result.props).length &&
            'entity' in result.props) {
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
    if (req.url === '/login' && req.method === 'GET') {
        res.statusCode = 200;
        res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
        res.write(await renderLogin());
        res.end();
        return;
    }
    if (req.url === '/home' && req.method === 'GET') {
        const result = await (0, activitypub_core_endpoints_1.homeGetHandler)(req, res, authenticationService, databaseService);
        if (result.redirect) {
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            res.write(await renderLogin());
            res.end();
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
    if (req.url.startsWith('/object/') ||
        req.url.startsWith('/actor/') ||
        req.url.startsWith('/activity/')) {
        const result = await (0, activitypub_core_endpoints_1.entityGetHandler)(req, res, authenticationService, databaseService);
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
    console.log('Not handled:', req.url);
    next();
};
exports.activityPub = activityPub;
//# sourceMappingURL=index.js.map