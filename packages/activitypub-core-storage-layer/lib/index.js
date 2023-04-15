"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageLayer = void 0;
class StorageLayer {
    upload;
    constructor({ store }) {
        this.upload = async (file) => await store.upload(file);
    }
}
exports.StorageLayer = StorageLayer;
//# sourceMappingURL=index.js.map