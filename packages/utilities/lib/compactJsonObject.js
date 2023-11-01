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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.compactJsonObject = void 0;
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types/jsonldDocumentLoader.d.ts" />
const node_1 = __importDefault(require("jsonld/lib/documentLoaders/node"));
const jsonld = __importStar(require("jsonld"));
const type_utilities_1 = require("@activity-kit/type-utilities");
const globals_1 = require("./globals");
/**
 * Compact a plain JSON object using known JSON-LD contexts, utilizing the
 * {@link jsonld} library. If the JSON object does not have a context, a
 * default context with the known contexts will be applied.
 *
 * @returns The compacted JSON-LD object.
 *
 * @see https://www.w3.org/TR/json-ld11/#compacted-document-form
 */
async function compactJsonObject(object) {
    var _a;
    let document = { ...object };
    if ('@context' in document) {
        const [expanded] = await jsonld.expand(document, {
            documentLoader: customLoader,
        });
        document = expanded;
    }
    else {
        document['@context'] = {
            '@vocab': globals_1.ACTIVITYSTREAMS_CONTEXT,
            sec: globals_1.W3ID_SECURITY_CONTEXT,
            schema: globals_1.SCHEMA_ORG_CONTEXT,
            id: '@id',
            type: '@type',
        };
    }
    const result = await jsonld.compact(document, {
        '@vocab': globals_1.ACTIVITYSTREAMS_CONTEXT,
        sec: globals_1.W3ID_SECURITY_CONTEXT,
        schema: globals_1.SCHEMA_ORG_CONTEXT,
        id: '@id',
        type: '@type',
    }, {
        documentLoader: customLoader,
    });
    return (_a = type_utilities_1.cast.isPlainObject(result)) !== null && _a !== void 0 ? _a : null;
}
exports.compactJsonObject = compactJsonObject;
/**
 * Custom document loader for JSON-LD that uses cached contexts.
 *
 * Bundling the contexts saves on the number of requests made when parsing
 * received JSON-LD documents.
 *
 * Based on the JSON-LD library's node document loader.
 *
 * @returns The remote JSON-LD document.
 */
async function customLoader(url, callback) {
    const nodeDocumentLoader = (0, node_1.default)();
    if (!nodeDocumentLoader) {
        throw new Error('nodeDocumentLoader is not defined');
    }
    const contextUrl = Object.keys(globals_1.CONTEXT_DEFINITIONS).find((key) => key === url);
    if (contextUrl) {
        return {
            contextUrl: undefined,
            document: {
                '@context': globals_1.CONTEXT_DEFINITIONS[contextUrl],
            },
            documentUrl: contextUrl,
        };
    }
    return nodeDocumentLoader(url, callback);
}
//# sourceMappingURL=compactJsonObject.js.map