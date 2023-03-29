"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPub = void 0;
const path_to_regexp_1 = require("path-to-regexp");
const activitypub_core_endpoints_1 = require("activitypub-core-endpoints");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activityPub = (config) => async (req, res, next) => {
    console.log('INCOMING:', req.url);
    const routes = {
        ...activitypub_core_utilities_1.DEFAULT_ROUTES,
        ...config.routes,
    };
    const matchesRoute = (path) => req.url.match((0, path_to_regexp_1.pathToRegexp)(path));
    const matchesEntityRoute = () => {
        for (const route of Object.values(routes)) {
            if (matchesRoute(route)) {
                return true;
            }
        }
        return false;
    };
    try {
        if (req.method === 'POST') {
            if (req.url === '/user') {
                await new activitypub_core_endpoints_1.UserPostEndpoint(routes, req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (req.url === '/sharedInbox') {
                await new activitypub_core_endpoints_1.SharedInboxPostEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (matchesRoute(routes.inbox)) {
                await new activitypub_core_endpoints_1.InboxPostEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (matchesRoute(routes.endpoint)) {
                await new activitypub_core_endpoints_1.UploadMediaPostEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (matchesRoute(routes.outbox)) {
                console.log(matchesRoute(routes.outbox));
                await new activitypub_core_endpoints_1.OutboxPostEndpoint(routes, req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
        }
        if (req.method === 'GET') {
            if (req.url === '/login') {
                res.statusCode = 200;
                res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
                res.write(await config.pages.login());
                res.end();
                next();
                return;
            }
            if (req.url.startsWith('/home')) {
                await new activitypub_core_endpoints_1.HomeGetEndpoint(req, res, config.adapters, config.plugins).respond(config.pages.home);
                next();
                return;
            }
            if (req.url.startsWith('/proxy')) {
                await new activitypub_core_endpoints_1.ProxyGetEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (req.url === '/.well-known/webfinger') {
                await new activitypub_core_endpoints_1.WebfingerGetEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (req.url === '/.well-known/host-meta') {
                await new activitypub_core_endpoints_1.HostMetaGetEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (req.url.startsWith('/.well-known/nodeinfo') ||
                req.url.startsWith('/nodeinfo')) {
                await new activitypub_core_endpoints_1.NodeinfoGetEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (matchesEntityRoute()) {
                await new activitypub_core_endpoints_1.EntityGetEndpoint(req, res, config.adapters, config.plugins).respond(config.pages.entity);
                next();
                return;
            }
        }
    }
    catch (error) {
        console.trace(error);
        next(new Error(`${error}`));
        return;
    }
    console.log('Not handled:', req.url);
    next();
};
exports.activityPub = activityPub;
//# sourceMappingURL=index.js.map