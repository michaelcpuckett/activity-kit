"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringsToUrls = void 0;
const globals_1 = require("./globals");
function convertStringsToUrls(originalEntity) {
    const entity = { ...originalEntity };
    for (const [key, value] of Object.entries(entity)) {
        if (!entity) {
            continue;
        }
        if (typeof value === 'string') {
            if (value === 'as:Public') {
                entity[key] = new URL(globals_1.PUBLIC_ACTOR);
                continue;
            }
            try {
                if (value.startsWith('http')) {
                    entity[key] = new URL(value);
                }
                else {
                    const date = Date.parse(value);
                    if (!Number.isNaN(date)) {
                        entity[key] = new Date(date);
                    }
                }
            }
            catch (error) {
                continue;
            }
        }
        else if (value instanceof URL || value instanceof Date) {
            continue;
        }
        else if (Array.isArray(value)) {
            entity[key] = value.map((item) => {
                if (typeof item === 'string') {
                    if (item === 'as:Public') {
                        return new URL(globals_1.PUBLIC_ACTOR);
                    }
                    try {
                        if (item.startsWith('http')) {
                            return new URL(item);
                        }
                        else {
                            const date = Date.parse(item);
                            if (!Number.isNaN(date)) {
                                return new Date(date);
                            }
                            else {
                                return item;
                            }
                        }
                    }
                    catch (error) {
                        return item;
                    }
                }
                else if (Array.isArray(item)) {
                    return item.map((arrayItem) => convertStringsToUrls(arrayItem));
                }
                else if (value && typeof value === 'object') {
                    return convertStringsToUrls(item);
                }
                else {
                    return item;
                }
            });
        }
        else if (value && typeof value === 'object') {
            entity[key] = convertStringsToUrls(value);
        }
    }
    return entity;
}
exports.convertStringsToUrls = convertStringsToUrls;
//# sourceMappingURL=convertStringsToUrls.js.map