"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCollectionNameByUrl = void 0;
const globals_1 = require("./globals");
const getCollectionNameByUrl = (url) => {
    const isLocal = url.hostname === globals_1.LOCAL_HOSTNAME;
    if (!isLocal) {
        return 'foreign-object';
    }
    const [, collectionName] = url.pathname.split('/');
    return collectionName;
};
exports.getCollectionNameByUrl = getCollectionNameByUrl;
//# sourceMappingURL=getCollectionNameByUrl.js.map