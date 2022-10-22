"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.homeGetHandler = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const cookie_1 = __importDefault(require("cookie"));
const homeGetHandler = async (req, res, authenticationService, databaseService, setup) => {
    const cookies = cookie_1.default.parse(req.headers.cookie ?? '');
    const actor = await databaseService.getActorByUserId(await authenticationService.getUserIdByToken(cookies.__session ?? ''));
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
    let data = {
        props: {
            actor,
        },
    };
    if (setup) {
        data = await setup(data, databaseService);
    }
    return {
        props: {
            actor: (0, activitypub_core_utilities_1.convertUrlsToStrings)(data.props.actor),
        },
    };
};
exports.homeGetHandler = homeGetHandler;
//# sourceMappingURL=index.js.map