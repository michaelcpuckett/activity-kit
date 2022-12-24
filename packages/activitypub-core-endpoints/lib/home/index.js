"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HomeGetEndpoint = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const cookie_1 = __importDefault(require("cookie"));
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
class HomeGetEndpoint {
    req;
    res;
    adapters;
    plugins;
    constructor(req, res, adapters, plugins) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
    }
    async respond(render) {
        const cookies = cookie_1.default.parse(this.req.headers.cookie ?? '');
        const actor = await this.adapters.db.getActorByUserId(await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''));
        if (!actor) {
            this.res.statusCode = 302;
            this.res.setHeader('Location', '/login');
            this.res.end();
            return;
        }
        if (!actor.inbox || !actor.outbox) {
            throw new Error('Bad actor.');
        }
        actor.inbox = await this.adapters.db.findEntityById(actor.inbox);
        actor.outbox = await this.adapters.db.findEntityById(actor.outbox);
        this.res.statusCode = 200;
        this.res.setHeader('Vary', 'Accept');
        if (this.req.headers.accept?.includes(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.LINKED_DATA_CONTENT_TYPE) ||
            this.req.headers.accept?.includes(activitypub_core_utilities_1.JSON_CONTENT_TYPE)) {
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
            this.res.write((0, activitypub_core_utilities_2.stringify)(actor));
        }
        else {
            this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.HTML_CONTENT_TYPE);
            let props = {
                actor,
            };
            if (this.plugins) {
                for (const plugin of this.plugins) {
                    if ('getHomePageProps' in plugin && plugin.getHomePageProps) {
                        props = {
                            ...props,
                            ...(await plugin.getHomePageProps(actor, this.req.url)),
                        };
                    }
                }
            }
            const formattedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => {
                return [key, (0, activitypub_core_utilities_1.convertUrlsToStrings)(value)];
            }));
            this.res.write(await render(formattedProps));
        }
        this.res.end();
    }
}
exports.HomeGetEndpoint = HomeGetEndpoint;
//# sourceMappingURL=index.js.map