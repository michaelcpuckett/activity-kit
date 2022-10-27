"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foafPlugin = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const foafPlugin = function (config) {
    return new (class FoafPlugin {
        handleCreateUserActor() {
        }
        createUserActor() {
            return {
                ...this.activity,
                '@context': [
                    activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT,
                    activitypub_core_utilities_1.W3ID_SECURITY_CONTEXT,
                    { "foaf": "http://xmlns.com/foaf/0.1/" }
                ],
                object: {
                    ...this.activity.object,
                    ...config.newPerson,
                }
            };
        }
    })();
};
exports.foafPlugin = foafPlugin;
//# sourceMappingURL=index.js.map