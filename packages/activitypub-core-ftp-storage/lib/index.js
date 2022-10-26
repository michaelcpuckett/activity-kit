"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FtpStorage = void 0;
const upload_1 = require("./upload");
class FtpStorage {
    config;
    upload = upload_1.upload;
    constructor(config) {
        this.config = config;
    }
}
exports.FtpStorage = FtpStorage;
//# sourceMappingURL=index.js.map