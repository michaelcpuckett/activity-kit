"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyContext = void 0;
const types_1 = require("@activity-kit/types");
const globals_1 = require("./globals");
function applyContext(entity) {
    (0, types_1.assertIsApEntity)(entity);
    if ((0, types_1.isTypeOf)(entity, types_1.AP.ActorTypes)) {
        if (!entity['@context']) {
            entity['@context'] = [
                new URL(globals_1.ACTIVITYSTREAMS_CONTEXT),
                new URL(globals_1.W3ID_SECURITY_CONTEXT),
                {
                    'schema:PropertyValue': new URL('https://schema.org/PropertyValue'),
                    'schema:value': new URL('https://schema.org/value'),
                    'schema:name': new URL('https://schema.org/name'),
                },
            ];
        }
        return entity;
    }
    if ((0, types_1.isTypeOf)(entity, types_1.AP.AllTypes)) {
        if (!entity['@context']) {
            entity['@context'] = new URL(globals_1.ACTIVITYSTREAMS_CONTEXT);
        }
        return entity;
    }
}
exports.applyContext = applyContext;
//# sourceMappingURL=applyContext.js.map