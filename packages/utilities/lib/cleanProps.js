"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanProps = void 0;
function cleanProps(entity) {
    const cleanedEntity = { ...entity };
    if ('bto' in cleanedEntity) {
        delete cleanedEntity.bto;
    }
    if ('bcc' in cleanedEntity) {
        delete cleanedEntity.bcc;
    }
    return cleanedEntity;
}
exports.cleanProps = cleanProps;
//# sourceMappingURL=cleanProps.js.map