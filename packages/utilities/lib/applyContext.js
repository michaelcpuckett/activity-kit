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
exports.applyContext = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const globals_1 = require("./globals");
function applyContext(entity) {
    if (type_utilities_1.guard.isApTypeOf(entity, AP.ActorTypes)) {
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
    if (type_utilities_1.guard.isApTypeOf(entity, AP.AllTypes)) {
        if (!entity['@context']) {
            entity['@context'] = new URL(globals_1.ACTIVITYSTREAMS_CONTEXT);
        }
        return entity;
    }
}
exports.applyContext = applyContext;
//# sourceMappingURL=applyContext.js.map