"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const cookie_1 = __importDefault(require("cookie"));
const respond = async function (render) {
    const cookies = cookie_1.default.parse(this.req.headers.cookie ?? '');
    const actor = await this.core.getActorByUserId(await this.core.getUserIdByToken(cookies.__session ?? ''));
    if (!actor) {
        this.res.statusCode = 302;
        this.res.setHeader('Location', '/login');
        this.res.end();
        return;
    }
    (0, types_1.assertIsApActor)(actor);
    const actorInbox = await this.core.findEntityById((0, utilities_1.getId)(actor.inbox));
    const actorOutbox = await this.core.findEntityById((0, utilities_1.getId)(actor.outbox));
    (0, types_1.assertIsApType)(actorInbox, types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    (0, types_1.assertIsApType)(actorOutbox, types_1.AP.CollectionTypes.ORDERED_COLLECTION);
    actor.inbox = actorInbox;
    actor.outbox = actorOutbox;
    this.res.statusCode = 200;
    this.res.setHeader('Vary', 'Accept');
    if (this.req.headers.accept?.includes(utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE) ||
        this.req.headers.accept?.includes(utilities_1.LINKED_DATA_CONTENT_TYPE) ||
        this.req.headers.accept?.includes(utilities_1.JSON_CONTENT_TYPE)) {
        this.res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE);
        this.res.write(JSON.stringify((0, utilities_1.convertEntityToJson)((0, utilities_1.cleanProps)((0, utilities_1.applyContext)(actor)))));
    }
    else {
        this.res.setHeader(utilities_1.CONTENT_TYPE_HEADER, utilities_1.HTML_CONTENT_TYPE);
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
            return [key, (0, utilities_1.convertEntityToJson)(value)];
        }));
        this.res.write(await render(formattedProps));
        this.res.end();
    }
};
exports.respond = respond;
//# sourceMappingURL=respond.js.map