"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const ftp_1 = __importDefault(require("ftp"));
async function upload(file) {
    return await new Promise((resolve, reject) => {
        const client = new ftp_1.default();
        client.on('ready', function () {
            client.put(file.filepath, file.newFilename, error => {
                client.end();
                if (error) {
                    reject(error);
                }
                else {
                    resolve(`https://${this.config.host}/${file.newFilename}`);
                }
            });
        });
        client.connect(this.config);
    });
}
exports.upload = upload;
//# sourceMappingURL=upload.js.map