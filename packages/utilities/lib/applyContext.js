"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyContext = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const globals_1 = require("./globals");
function applyContext(entity) {
    if (!entity['@context']) {
        if (type_utilities_1.guard.isApActor(entity)) {
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
        else {
            entity['@context'] = new URL(globals_1.ACTIVITYSTREAMS_CONTEXT);
        }
    }
    return entity;
}
exports.applyContext = applyContext;
//# sourceMappingURL=applyContext.js.map