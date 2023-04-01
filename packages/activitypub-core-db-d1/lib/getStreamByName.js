"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamByName = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
async function getStreamByName(actor, name) {
    (0, activitypub_core_types_1.assertIsArray)(actor.streams);
    const streams = await Promise.all(actor.streams.map(async (stream) => {
        const streamId = (0, activitypub_core_utilities_1.getId)(stream);
        if (!streamId) {
            return null;
        }
        return await this.findEntityById(streamId);
    }));
    for (const stream of streams) {
        try {
            (0, activitypub_core_types_1.assertIsApCollection)(stream);
            if (stream.name === name) {
                return stream;
            }
        }
        catch (error) {
            break;
        }
    }
    return null;
}
exports.getStreamByName = getStreamByName;
//# sourceMappingURL=getStreamByName.js.map