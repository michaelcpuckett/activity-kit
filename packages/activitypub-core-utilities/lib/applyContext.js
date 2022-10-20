"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyContext = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const isTypeOf_1 = require("./isTypeOf");
const globals_1 = require("./globals");
function applyContext(entity) {
    if (!entity['@context']) {
        if ((0, isTypeOf_1.isTypeOf)(entity, activitypub_core_types_1.AP.ActorTypes)) {
            entity['@context'] = [
                new URL(globals_1.ACTIVITYSTREAMS_CONTEXT),
                new URL(globals_1.W3ID_SECURITY_CONTEXT),
            ];
        }
        else {
            entity['@context'] = new URL(globals_1.ACTIVITYSTREAMS_CONTEXT);
        }
    }
    return entity;
}
exports.applyContext = applyContext;
//# sourceMappingURL=applyContext.js.map