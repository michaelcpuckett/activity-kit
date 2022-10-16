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
exports.generateKeyPair = void 0;
const crypto = __importStar(require("crypto"));
async function generateKeyPair() {
    const { publicKey, privateKey, } = await crypto.subtle.generateKey({
        name: 'RSASSA-PKCS1-v1_5',
        modulusLength: 2048,
        hash: { name: 'SHA-256' },
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
    }, true, ['encrypt', 'decrypt', 'sign', 'verify']);
    return {
        publicKey: arrayBufferToString(await crypto.subtle.exportKey('pkcs8', publicKey)),
        privateKey: arrayBufferToString(await crypto.subtle.exportKey('pkcs8', privateKey)),
    };
}
exports.generateKeyPair = generateKeyPair;
function arrayBufferToString(buffer) {
    var bufView = new Uint16Array(buffer);
    var length = bufView.length;
    var result = '';
    var addition = Math.pow(2, 16) - 1;
    for (var i = 0; i < length; i += addition) {
        if (i + addition > length) {
            addition = length - i;
        }
        result += String.fromCharCode.apply(null, bufView.subarray(i, i + addition));
    }
    return result;
}
//# sourceMappingURL=generateKeyPair.js.map