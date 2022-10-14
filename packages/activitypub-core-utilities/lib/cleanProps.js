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