"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.streamToString = void 0;
/**
 * Converts an HTTP stream to a string.
 *
 * @returns The string.
 *
 * @todo This is being depricated in favor of having adapters handle this.
 */
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