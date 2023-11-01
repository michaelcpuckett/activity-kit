"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNotFound = void 0;
async function handleNotFound() {
    return {
        statusCode: 404,
        body: JSON.stringify({
            error: 'Not found.',
        }),
    };
}
exports.handleNotFound = handleNotFound;
//# sourceMappingURL=handleNotFound.js.map