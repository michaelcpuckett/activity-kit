"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContext = void 0;
const globals_1 = require("../globals");
const activitypub_core_types_1 = require("activitypub-core-types");
function addContext(entity) {
    for (const type of Object.values(activitypub_core_types_1.AP.ActorTypes)) {
        if (type === entity.type) {
            return {
                '@context': [
                    new URL(globals_1.ACTIVITYSTREAMS_CONTEXT),
                    new URL(globals_1.W3ID_SECURITY_CONTEXT),
                ],
                ...entity,
            };
        }
    }
    return {
        '@context': new URL(globals_1.ACTIVITYSTREAMS_CONTEXT),
        ...entity,
    };
}
exports.addContext = addContext;
//# sourceMappingURL=addContext.js.map