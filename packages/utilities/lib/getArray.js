"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArray = void 0;
const getArray = (items) => {
    if (!items) {
        return [];
    }
    return Array.isArray(items) ? items : items instanceof URL ? [] : [items];
};
exports.getArray = getArray;
//# sourceMappingURL=getArray.js.map