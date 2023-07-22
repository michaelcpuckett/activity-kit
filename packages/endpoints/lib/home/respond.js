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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.respond = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
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
    (0, type_utilities_1.assertIsApActor)(actor);
    const actorInbox = await this.core.findEntityById((0, utilities_1.getId)(actor.inbox));
    const actorOutbox = await this.core.findEntityById((0, utilities_1.getId)(actor.outbox));
    (0, type_utilities_1.assertIsApType)(actorInbox, AP.CollectionTypes.ORDERED_COLLECTION);
    (0, type_utilities_1.assertIsApType)(actorOutbox, AP.CollectionTypes.ORDERED_COLLECTION);
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