"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtpStorageAdapter = void 0;
const upload_1 = require("./upload");
class FtpStorageAdapter {
    params;
    upload = upload_1.upload;
    constructor(params) {
        this.params = {
            host: params.host,
            user: params.user,
            password: params.password,
            path: params.path,
        };
    }
}
exports.FtpStorageAdapter = FtpStorageAdapter;
//# sourceMappingURL=index.js.map