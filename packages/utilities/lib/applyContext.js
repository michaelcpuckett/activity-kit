"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyContext = void 0;
const types_1 = require("@activity-kit/types");
const isType_1 = require("./isType");
const globals_1 = require("./globals");
function applyContext(entity) {
    if (!entity['@context']) {
        if ((0, isType_1.isTypeOf)(entity, types_1.AP.ActorTypes)) {
            entity['@context'] = [
                new URL(globals_1.ACTIVITYSTREAMS_CONTEXT),
                new URL(globals_1.W3ID_SECURITY_CONTEXT),
                {
                    PropertyValue: 'https://schema.org/PropertyValue',
                    value: 'https://schema.org/value',
                },
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