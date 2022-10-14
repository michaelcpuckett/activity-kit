"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanProps = void 0;
function cleanProps(entity) {
    const result = { ...entity };
    if ('bto' in result) {
        delete result.bto;
    }
    if ('bcc' in result) {
        delete result.bcc;
    }
    return result;
}
exports.cleanProps = cleanProps;
//# sourceMappingURL=cleanProps.js.map