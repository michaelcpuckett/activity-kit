"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foafPlugin = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const foafPlugin = function (config) {
    const foafPlugin = {
        handleCreateUserActor() {
            console.log('handleCreateUserActor');
            console.log(config.newPerson);
            if (!config.newPerson) {
                return this.activity;
            }
            console.log(this.activity);
            console.log('^ the activity');
            if (!('object' in this.activity) || this.activity.object instanceof URL || Array.isArray(this.activity.object)) {
                return this.activity;
            }
            console.log({
                ...this.activity,
                '@context': [
                    new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
                    new URL(activitypub_core_utilities_1.W3ID_SECURITY_CONTEXT),
                    { "foaf": new URL("http://xmlns.com/foaf/0.1/") }
                ],
                object: {
                    ...this.activity.object,
                    ...(0, activitypub_core_utilities_1.convertStringsToUrls)(config.newPerson),
                }
            });
            console.log('will return a value');
            return {
                ...this.activity,
                '@context': [
                    new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
                    new URL(activitypub_core_utilities_1.W3ID_SECURITY_CONTEXT),
                    { "foaf": new URL("http://xmlns.com/foaf/0.1/") }
                ],
                object: {
                    ...this.activity.object,
                    ...(0, activitypub_core_utilities_1.convertStringsToUrls)(config.newPerson),
                    '@context': [
                        new URL(activitypub_core_utilities_1.ACTIVITYSTREAMS_CONTEXT),
                        { "foaf": new URL("http://xmlns.com/foaf/0.1/") }
                    ],
                }
            };
        }
    };
    return foafPlugin;
};
exports.foafPlugin = foafPlugin;
//# sourceMappingURL=index.js.map