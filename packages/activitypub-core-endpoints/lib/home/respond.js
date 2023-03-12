"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const cookie_1 = __importDefault(require("cookie"));
const activitypub_core_utilities_2 = require("activitypub-core-utilities");
const respond = async function (render) {
    const cookies = cookie_1.default.parse(this.req.headers.cookie ?? '');
    const actor = await this.adapters.db.getActorByUserId(await this.adapters.auth.getUserIdByToken(cookies.__session ?? ''));
    if (!actor) {
        this.res.statusCode = 302;
        this.res.setHeader('Location', '/login');
        this.res.end();
        return;
    }
    (0, activitypub_core_types_1.assertIsApActor)(actor);
    const actorInbox = await this.adapters.db.findEntityById((0, activitypub_core_utilities_1.getId)(actor.inbox));
    const actorOutbox = await this.adapters.db.findEntityById((0, activitypub_core_utilities_1.getId)(actor.outbox));
    (0, activitypub_core_types_1.assertIsApType)(actorInbox, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    (0, activitypub_core_types_1.assertIsApType)(actorOutbox, activitypub_core_types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    actor.inbox = actorInbox;
    actor.outbox = actorOutbox;
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
                        ...(await plugin.getHomePageProps.call(this, actor, this.req.url)),
                    };
                }
            }
        }
        const formattedProps = Object.fromEntries(Object.entries(props).map(([key, value]) => {
            return [key, (0, activitypub_core_utilities_1.convertUrlsToStrings)(value)];
        }));
        this.res.write(await render(formattedProps));
        this.res.end();
    }
};
exports.respond = respond;
//# sourceMappingURL=respond.js.map