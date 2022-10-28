"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoafPlugin = void 0;
const FoafPlugin = function (config) {
    const foafPlugin = {
        handleCreateUserActor() {
            return this.activity;
        }
    };
    return foafPlugin;
};
exports.FoafPlugin = FoafPlugin;
//# sourceMappingURL=index.js.map