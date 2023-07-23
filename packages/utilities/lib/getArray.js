"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArray = void 0;
const getArray = (items) => {
    return items
        ? Array.isArray(items)
            ? items
            : items[0] instanceof URL
                ? []
                : [items]
        : [];
};
exports.getArray = getArray;
//# sourceMappingURL=getArray.js.map