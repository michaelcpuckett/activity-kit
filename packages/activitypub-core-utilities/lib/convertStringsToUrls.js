"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertStringsToUrls = void 0;
function convertStringsToUrls(originalEntity) {
    const entity = { ...originalEntity };
    for (const [key, value] of Object.entries(entity)) {
        if (!entity) {
            continue;
        }
        if (typeof value === 'string') {
            try {
                entity[key] = new URL(value);
            }
            catch (error) {
                try {
                    const date = Date.parse(value);
                    if (!Number.isNaN(date)) {
                        entity[key] = new Date(date);
                    }
                }
                catch (error) {
                    continue;
                }
            }
        }
        else if (value instanceof URL || value instanceof Date) {
            continue;
        }
        else if (Array.isArray(value)) {
            entity[key] = value.map((item) => {
                if (typeof item === 'string') {
                    try {
                        return new URL(item);
                    }
                    catch (error) {
                        try {
                            const date = Date.parse(item);
                            if (!Number.isNaN(date)) {
                                return new Date(date);
                            }
                            else {
                                return item;
                            }
                        }
                        catch (error) {
                            return item;
                        }
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