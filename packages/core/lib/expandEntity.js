"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandEntity = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
async function expandEntity(entity) {
    const expandEntry = async (key, value) => {
        if (key === '_id' ||
            key === 'id' ||
            key === 'url' ||
            key === 'type' ||
            key === '@context' ||
            key === 'publicKey') {
            return value;
        }
        else if (value instanceof URL) {
            if (value.toString() === utilities_1.PUBLIC_ACTOR) {
                return value;
            }
            else {
                try {
                    const foundEntity = await this.queryById(value);
                    return foundEntity ?? value;
                }
                catch (error) {
                    return value;
                }
            }
        }
        else if (Array.isArray(value)) {
            return await Promise.all(value.map(expandEntry));
        }
        else {
            return value;
        }
    };
    const expanded = {};
    for (const [key, value] of Object.entries(entity)) {
        expanded[key] = await expandEntry(key, value);
    }
    if ((0, types_1.isTypeOf)(expanded, types_1.AP.AllTypes)) {
        return expanded;
    }
    return null;
}
exports.expandEntity = expandEntity;
//# sourceMappingURL=expandEntity.js.map