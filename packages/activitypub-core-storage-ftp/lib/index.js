"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtpStorageAdapter = void 0;
const upload_1 = require("./upload");
class FtpStorageAdapter {
    host;
    user;
    password;
    path;
    upload = upload_1.upload;
    constructor(config, path) {
        this.host = config.host;
        this.user = config.user;
        this.password = config.password;
        this.path = path;
    }
}
exports.FtpStorageAdapter = FtpStorageAdapter;
//# sourceMappingURL=index.js.map