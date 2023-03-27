"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activityPub = void 0;
const pathToRegexp = __importStar(require("path-to-regexp"));
const activitypub_core_endpoints_1 = require("activitypub-core-endpoints");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activityPub = (config) => async (req, res, next) => {
    console.log('INCOMING:', req.url);
    const routes = {
        actor: '/@:actor',
        object: '/:type/:id',
        activity: '/:type/:id',
        inbox: '/@:actor/inbox',
        outbox: '/@:actor/outbox',
        followers: '/@:actor/followers',
        following: '/@:actor/following',
        liked: '/@:actor/liked',
        shared: '/@:actor/shared',
        uploadMedia: '/@:actor/uploadMedia',
        collections: '/@:actor/collection/:id',
        blocked: '/@:actor/blocked',
        likes: '/:type/:id/likes',
        shares: '/:type/:id/shares',
        replies: '/:type/:id/replies',
        ...config.routes,
    };
    const matches = (path) => req.url.match(pathToRegexp.pathToRegexp(path));
    try {
        if (req.method === 'POST') {
            if (req.url === '/user') {
                await new activitypub_core_endpoints_1.UserPostEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (req.url === '/sharedInbox') {
                await new activitypub_core_endpoints_1.SharedInboxPostEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (matches(typeof routes.inbox === 'function'
                ? routes.inbox(':actor')
                : routes.inbox)) {
                await new activitypub_core_endpoints_1.InboxPostEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (matches(typeof routes.uploadMedia === 'function'
                ? routes.uploadMedia(':actor')
                : routes.uploadMedia)) {
                await new activitypub_core_endpoints_1.UploadMediaPostEndpoint(req, res, config.adapters, config.plugins).respond();
                next();
                return;
            }
            if (matches(typeof routes.inbox === 'function'
                ? routes.inbox(':actor')
                : routes.inbox)) {
                await new activitypub_core_endpoints_1.OutboxPostEndpoint(req, res, config.adapters, config.plugins).respond();
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
            if (matches(typeof routes.actor === 'function'
                ? routes.actor(':actor')
                : routes.actor) ||
                matches(typeof routes.following === 'function'
                    ? routes.following(':actor')
                    : routes.following) ||
                matches(typeof routes.followers === 'function'
                    ? routes.followers(':actor')
                    : routes.followers) ||
                matches(typeof routes.liked === 'function'
                    ? routes.liked(':actor')
                    : routes.liked) ||
                matches(typeof routes.likes === 'function'
                    ? routes.likes(':id', ':type')
                    : routes.likes) ||
                matches(typeof routes.replies === 'function'
                    ? routes.replies(':id', ':type')
                    : routes.replies) ||
                matches(typeof routes.shared === 'function'
                    ? routes.shared(':actor')
                    : routes.shared) ||
                matches(typeof routes.shares === 'function'
                    ? routes.shares(':id', ':type')
                    : routes.shares) ||
                matches(typeof routes.blocked === 'function'
                    ? routes.blocked(':actor')
                    : routes.blocked) ||
                matches(typeof routes.inbox === 'function'
                    ? routes.inbox(':actor')
                    : routes.inbox) ||
                matches(typeof routes.outbox === 'function'
                    ? routes.outbox(':actor')
                    : routes.outbox) ||
                (() => {
                    for (const plugin of config.plugins) {
                        if ('getIsEntityGetRequest' in plugin) {
                            if (plugin.getIsEntityGetRequest(req.url)) {
                                return true;
                            }
                        }
                    }
                })()) {
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