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
exports.convertJsonLdToEntity = void 0;
const jsonld = __importStar(require("jsonld"));
// See types/jsonldDocumentLoader.d.ts
const node_1 = __importDefault(require("jsonld/lib/documentLoaders/node"));
const globals_1 = require("./globals");
const convertJsonToEntity_1 = require("./convertJsonToEntity");
const applyContext_1 = require("./applyContext");
/**
 * Converts a JSON-LD object to a compacted ActivityPub Entity.
 *
 * First, the JSON-LD object is compacted using the `jsonld` library. It uses
 * the ActivityPub context as the base context and adds the following contexts
 * to it:
 *
 * - https://w3id.org/security/v1 for encryption/signatures
 * - https://schema.org for Mastodon's profile metadata
 *
 * Then, the compacted object is converted to an ActivityPub Entity.
 *
 * @todo An updated context
 * will be applied to the Entity, unless it already has one.
 *
 * @returns The ActivityPub Entity.
 *
 * @see https://www.w3.org/TR/json-ld11/#compacted-document-form
 */
async function convertJsonLdToEntity(document) {
    const result = await jsonld.compact(document, globals_1.DEFAULT_ACTOR_CONTEXT, {
        documentLoader: customLoader,
    });
    const converted = (0, convertJsonToEntity_1.convertJsonToEntity)(result);
    if (!converted) {
        return null;
    }
    return (0, applyContext_1.applyContext)(converted);
}
exports.convertJsonLdToEntity = convertJsonLdToEntity;
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
//# sourceMappingURL=convertJsonLdToEntity.js.map