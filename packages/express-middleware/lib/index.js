"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityKitPlugin = void 0;
const path_to_regexp_1 = require("path-to-regexp");
const endpoints_1 = require("@activity-kit/endpoints");
const utilities_1 = require("@activity-kit/utilities");
const core_1 = require("@activity-kit/core");
const activityKitPlugin = (config) => async (req, res, next) => {
    console.log('INCOMING:', req.url);
    const core = new core_1.Core({
        auth: config.adapters.auth,
        crypto: config.adapters.crypto,
        db: config.adapters.db,
        storage: config.adapters.storage,
    });
    const routes = {
        ...utilities_1.DEFAULT_ROUTES,
        ...config.routes,
    };
    const matchesRoute = (path) => new URL(req.url, utilities_1.LOCAL_DOMAIN).pathname.match((0, path_to_regexp_1.pathToRegexp)(path));
    const getEntityRouteParams = () => {
        for (const route of Object.values(routes)) {
            if (matchesRoute(route)) {
                const matches = (0, path_to_regexp_1.match)(route)(req.url);
                if (matches) {
                    return matches.params;
                }
            }
        }
        for (const collectionRoute of [
            routes.serverInbox,
            routes.serverOutbox,
            routes.serverFollowers,
            routes.serverFollowing,
            routes.serverHashtags,
            routes.inbox,
            routes.outbox,
            routes.followers,
            routes.following,
            routes.liked,
            routes.stream,
            routes.hashtag,
            routes.likes,
            routes.shares,
            routes.replies,
        ]) {
            const collectionPageRoute = (collectionRoute === '/' ? '' : collectionRoute) + '/page/:page';
            if (matchesRoute(collectionPageRoute)) {
                const matches = (0, path_to_regexp_1.match)(collectionPageRoute)(req.url);
                if (matches) {
                    return matches.params;
                }
            }
        }
        return false;
    };
    try {
        if (req.method === 'POST') {
            if (req.url === '/user') {
                await new endpoints_1.UserPostEndpoint(routes, req, res, core, config.plugins).respond();
                next();
                return;
            }
            if (req.url === '/sharedInbox') {
                await new endpoints_1.SharedInboxPostEndpoint(routes, req, res, core, config.plugins).respond();
                next();
                return;
            }
            if (matchesRoute(routes.inbox)) {
                await new endpoints_1.InboxPostEndpoint(routes, req, res, core, config.plugins).respond();
                next();
                return;
            }
            if (matchesRoute(routes.endpoint)) {
                await new endpoints_1.UploadMediaPostEndpoint(routes, req, res, core, config.plugins).respond();
                next();
                return;
            }
            if (matchesRoute(routes.outbox)) {
                await new endpoints_1.OutboxPostEndpoint(routes, req, res, core, config.plugins).respond();
                next();
                return;
            }
        }
        if (req.method === 'GET') {
            if (req.url === '/login') {
                res.statusCode = 200;
                res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.HTML_CONTENT_TYPE);
                res.write(await config.pages.login());
                res.end();
                next();
                return;
            }
            if (req.url.startsWith('/home')) {
                await new endpoints_1.HomeGetEndpoint(req, res, core, config.plugins).respond(config.pages.home);
                next();
                return;
            }
            if (req.url.startsWith('/proxy')) {
                await new endpoints_1.ProxyGetEndpoint(req, res, core, config.plugins).respond();
                next();
                return;
            }
            if (req.url.startsWith('/.well-known/webfinger')) {
                await new endpoints_1.WebfingerGetEndpoint(req, res, core, config.plugins).respond();
                next();
                return;
            }
            if (req.url === '/.well-known/host-meta') {
                await new endpoints_1.HostMetaGetEndpoint(req, res, core, config.plugins).respond();
                next();
                return;
            }
            if (req.url.startsWith('/.well-known/nodeinfo') ||
                req.url.startsWith('/nodeinfo')) {
                await new endpoints_1.NodeinfoGetEndpoint(req, res, core, config.plugins).respond();
                next();
                return;
            }
            const entityParams = getEntityRouteParams();
            if (entityParams) {
                req.params = entityParams;
                await new endpoints_1.EntityGetEndpoint(req, res, core, config.plugins).respond(config.pages.entity);
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
exports.activityKitPlugin = activityKitPlugin;
//# sourceMappingURL=index.js.map