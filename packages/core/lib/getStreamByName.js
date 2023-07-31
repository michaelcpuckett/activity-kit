"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamByName = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
async function getStreamByName(actor, name) {
    if (!actor.streams) {
        return null;
    }
    const streams = await Promise.all(actor.streams.map(async (stream) => {
        const streamId = (0, utilities_1.getId)(stream);
        if (!streamId) {
            return null;
        }
        return await this.queryById(streamId);
    }));
    for (const stream of streams) {
        if (type_utilities_1.guard.isApCollection(stream)) {
            if (stream.name === name) {
                return stream;
            }
        }
    }
    return null;
}
exports.getStreamByName = getStreamByName;
//# sourceMappingURL=getStreamByName.js.map