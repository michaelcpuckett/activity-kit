"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPub = void 0;
const activitypub_core_endpoints_1 = require("activitypub-core-endpoints");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activityPub = (pages, adapters, plugins) => async (req, res, next) => {
    console.log('INCOMING:', req.url, 'FROM:', req.headers.referer ?? req.socket.remoteAddress);
    if (req.method === 'POST') {
        if (req.url === '/user') {
            await new activitypub_core_endpoints_1.UserPostEndpoint(req, res, adapters, plugins).respond();
            next();
            return;
        }
        if (req.url === '/sharedInbox') {
            await new activitypub_core_endpoints_1.SharedInboxPostEndpoint(req, res, adapters, plugins).respond();
            next();
            return;
        }
        if (req.url.startsWith('/actor/') && req.url.endsWith('/inbox')) {
            await new activitypub_core_endpoints_1.InboxPostEndpoint(req, res, adapters, plugins).respond();
            next();
            return;
        }
        if (req.url.startsWith('/actor/') && req.url.endsWith('/uploadMedia')) {
            await new activitypub_core_endpoints_1.UploadMediaPostEndpoint(req, res, adapters, plugins).respond();
            next();
            return;
        }
        if (req.url.startsWith('/actor/') && req.url.endsWith('/outbox')) {
            await new activitypub_core_endpoints_1.OutboxPostEndpoint(req, res, adapters, plugins).respond();
            next();
            return;
        }
    }
    if (req.method === 'GET') {
        if (req.url === '/login') {
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            res.write(await pages.login());
            res.end();
            next();
            return;
        }
        if (req.url === '/home') {
            await new activitypub_core_endpoints_1.HomeGetEndpoint(req, res, adapters, plugins).respond(pages.home);
            next();
            return;
        }
        if (req.url.startsWith('/.well-known/webfinger')) {
            await new activitypub_core_endpoints_1.WebfingerGetEndpoint(req, res, adapters, plugins).respond();
            next();
            return;
        }
        if (req.url.startsWith('/object/') ||
            req.url.startsWith('/actor/') ||
            req.url.startsWith('/activity/')) {
            await new activitypub_core_endpoints_1.EntityGetEndpoint(req, res, adapters, plugins).respond(pages.entity);
            next();
            return;
        }
    }
    console.log('Not handled:', req.url);
    next();
};
exports.activityPub = activityPub;
//# sourceMappingURL=index.js.map