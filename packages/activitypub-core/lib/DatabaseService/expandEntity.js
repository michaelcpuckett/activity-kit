"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.expandEntity = void 0;
const globals_1 = require("../globals");
async function expandEntity(originalEntity) {
    const entity = { ...originalEntity };
    for (const [key, value] of Object.entries(entity)) {
        if (key === 'id' ||
            key === 'url' ||
            key === 'type' ||
            key === globals_1.CONTEXT ||
            key === '_id' ||
            key === 'publicKey') {
            continue;
        }
        else if (value instanceof URL) {
            if (!(value.toString() === globals_1.PUBLIC_ACTOR)) {
                try {
                    const foundEntity = await this.queryById(value);
                    if (foundEntity) {
                        entity[key] = foundEntity;
                    }
                }
                catch (error) {
                    continue;
                }
            }
        }
        else if (Array.isArray(value)) {
            const array = [...value];
            entity[key] = await Promise.all(array.map(async (item) => {
                if (item instanceof URL) {
                    if (item.toString() === globals_1.PUBLIC_ACTOR) {
                        return item;
                    }
                    if (item instanceof URL) {
                        const foundEntity = await this.queryById(item);
                        if (foundEntity) {
                            return foundEntity;
                        }
                        return item;
                    }
                    try {
                        const url = new URL(item);
                        const foundEntity = await this.queryById(url);
                        if (foundEntity) {
                            return foundEntity;
                        }
                        return item;
                    }
                    catch (error) {
                        return item;
                    }
                }
                return item;
            }));
        }
    }
    return entity;
}
exports.expandEntity = expandEntity;
//# sourceMappingURL=expandEntity.js.map