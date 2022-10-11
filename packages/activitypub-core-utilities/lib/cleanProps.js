"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanProps = void 0;
const convertStringsToUrls_1 = require("./convertStringsToUrls");
function cleanProps(entity) {
    const result = (0, convertStringsToUrls_1.convertStringsToUrls)({ ...entity });
    if ('bto' in result) {
        delete result.bto;
    }
    if ('bcc' in result) {
        delete result.bcc;
    }
    if ('object' in result && result.object && !(result.object instanceof URL)) {
        if ('bto' in result.object) {
            delete result.object.bto;
        }
        if ('bcc' in result.object) {
            delete result.object.bcc;
        }
    }
    return result;
}
exports.cleanProps = cleanProps;
//# sourceMappingURL=cleanProps.js.map