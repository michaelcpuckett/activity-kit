"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToString = void 0;
async function streamToString(stream) {
    if (stream) {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(Buffer.from(chunk));
        }
        return Buffer.concat(chunks).toString('utf-8');
    }
    return '';
}
exports.streamToString = streamToString;
//# sourceMappingURL=streamToString.js.map