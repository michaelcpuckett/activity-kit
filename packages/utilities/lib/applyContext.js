"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyContext = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const globals_1 = require("./globals");
/**
 * Applies the default JSON-LD context to an {@link AP.Entity}.
 *
 * If the Entity already has a context, it will not be overwritten. This
 * function does not use JSON-LD compaction.
 *
 * @returns The {@link AP.Entity} with the default context applied.
 *
 * @see https://www.w3.org/TR/json-ld11/#the-context
 */
function applyContext(entity) {
    if (!entity['@context']) {
        if (type_utilities_1.guard.isApActor(entity)) {
            entity['@context'] = globals_1.DEFAULT_ACTOR_CONTEXT_AS_URLS;
        }
        else {
            entity['@context'] = new URL(globals_1.ACTIVITYSTREAMS_CONTEXT);
        }
    }
    return entity;
}
exports.applyContext = applyContext;
//# sourceMappingURL=applyContext.js.map