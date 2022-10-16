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
exports.webfingerHandler = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const queryString = __importStar(require("query-string"));
async function webfingerHandler(req, res, databaseService) {
    if (!req || !req.url) {
        throw new Error('Bad request');
    }
    console.log(new URL(req.url, activitypub_core_utilities_1.LOCAL_DOMAIN));
    const query = {
        ...queryString.parse(new URL(req.url, activitypub_core_utilities_1.LOCAL_DOMAIN).search),
    };
    const resource = query.resource ?? '';
    const [account] = resource.split('@');
    const [, username] = account.split(':');
    if (username) {
        const actor = await databaseService.findOne('actor', {
            preferredUsername: username,
        });
        if (actor) {
            const finger = {
                subject: `acct:${username}@${activitypub_core_utilities_1.LOCAL_HOSTNAME}`,
                links: [
                    {
                        rel: 'http://webfinger.net/rel/profile-page',
                        type: activitypub_core_utilities_1.HTML_CONTENT_TYPE,
                        href: actor.url.toString(),
                    },
                    {
                        rel: 'self',
                        type: activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTENT_TYPE,
                        href: actor.url.toString(),
                    },
                ],
            };
            console.log('sending FINGER:');
            console.log(finger);
            res.statusCode = 200;
            res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JSON_CONTENT_TYPE);
            res.write(JSON.stringify(finger));
            res.end();
            return;
        }
    }
    res.statusCode = 404;
    res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JSON_CONTENT_TYPE);
    res.end();
}
exports.webfingerHandler = webfingerHandler;
//# sourceMappingURL=index.js.map