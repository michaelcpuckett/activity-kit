"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const ftp_1 = __importDefault(require("ftp"));
const activitypub_core_types_1 = require("activitypub-core-types");
async function upload(file) {
    return await new Promise((resolve, reject) => {
        const client = new ftp_1.default();
        const { host, path = '/', user, password } = this.params;
        (0, activitypub_core_types_1.assertIsString)(host);
        (0, activitypub_core_types_1.assertIsString)(user);
        (0, activitypub_core_types_1.assertIsString)(password);
        (0, activitypub_core_types_1.assertIsString)(path);
        client.on('ready', () => {
            client.put(file.filepath, file.newFilename, (error) => {
                client.end();
                if (error) {
                    reject(error);
                }
                else {
                    resolve(new URL(`https://${host}${path}/${file.newFilename}`));
                }
            });
        });
        client.connect({
            host,
            user,
            password,
        });
    });
}
exports.upload = upload;
//# sourceMappingURL=upload.js.map