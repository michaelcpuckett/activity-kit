"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubtleCryptoAdapter = void 0;
const generateKeyPair_1 = require("./generateKeyPair");
const randomBytes_1 = require("./randomBytes");
const hashPassword_1 = require("./hashPassword");
const getHttpSignature_1 = require("./getHttpSignature");
class SubtleCryptoAdapter {
    params;
    constructor(subtle) {
        this.params = {
            subtle,
        };
    }
    generateKeyPair = generateKeyPair_1.generateKeyPair;
    randomBytes = randomBytes_1.randomBytes;
    hashPassword = hashPassword_1.hashPassword;
    getHttpSignature = getHttpSignature_1.getHttpSignature;
}
exports.SubtleCryptoAdapter = SubtleCryptoAdapter;
//# sourceMappingURL=index.js.map