"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getServerSideProps = void 0;
const types_1 = require("../../types");
const DatabaseService_1 = require("../../DatabaseService");
const convertUrlsToStrings_1 = require("../../utilities/convertUrlsToStrings");
const cookie_1 = __importDefault(require("cookie"));
const getServerSideProps = async ({ req, res, }, serviceAccount, setup, providedDatabaseService) => {
    const databaseService = providedDatabaseService ?? (await DatabaseService_1.DatabaseService.connect());
    const cookies = cookie_1.default.parse(req.headers.cookie);
    const actor = await databaseService.getActorByToken(cookies.__session ?? '', serviceAccount);
    if (!actor) {
        return {
            redirect: {
                permanent: false,
                destination: '/',
            },
        };
    }
    if (!actor.inbox || !actor.outbox) {
        throw new Error('Bad actor.');
    }
    const [inbox, outbox, followers, following,] = await Promise.all([
        databaseService.expandCollection(actor.inbox),
        databaseService.expandCollection(actor.outbox),
        ...actor.followers ? [databaseService.expandCollection(actor.followers)] : [],
        ...actor.following ? [databaseService.expandCollection(actor.following)] : [],
    ]);
    if (!inbox || !outbox) {
        throw new Error('Bad actor.');
    }
    actor.inbox = inbox;
    actor.outbox = outbox;
    if (followers) {
        actor.followers = followers;
    }
    if (following) {
        actor.following = following;
    }
    const streams = [];
    for (const stream of actor.streams || []) {
        if (stream instanceof URL) {
            const foundStream = await databaseService.findEntityById(stream);
            if (foundStream &&
                (foundStream.type === types_1.AP.CollectionTypes.COLLECTION ||
                    foundStream.type === types_1.AP.CollectionTypes.ORDERED_COLLECTION)) {
                const expandedStream = await databaseService.expandCollection(foundStream);
                if (expandedStream) {
                    streams.push(expandedStream);
                }
            }
        }
        else {
            const expandedStream = await databaseService.expandCollection(stream);
            if (expandedStream) {
                streams.push(expandedStream);
            }
        }
    }
    if (actor.streams) {
        actor.streams = streams;
    }
    let props = {
        actor,
    };
    if (setup) {
        props = await setup(props, databaseService);
    }
    return {
        props: {
            actor: (0, convertUrlsToStrings_1.convertUrlsToStrings)(props.actor),
        },
    };
};
exports.getServerSideProps = getServerSideProps;
//# sourceMappingURL=index.js.map