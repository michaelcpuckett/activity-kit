"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStreamByName = void 0;
const type_utilities_1 = require("@activity-kit/type-utilities");
const utilities_1 = require("@activity-kit/utilities");
const getStreamByName = async function (actor, name) {
    (0, type_utilities_1.assertIsArray)(actor.streams);
    const streams = await Promise.all(actor.streams.map(async (stream) => {
        const streamId = (0, utilities_1.getId)(stream);
        if (!streamId) {
            return null;
        }
        return await this.queryById(streamId);
    }));
    for (const stream of streams) {
        try {
            (0, type_utilities_1.assertIsApCollection)(stream);
            if (stream.name === name) {
                return stream;
            }
        }
        catch (error) {
            break;
        }
    }
    return null;
};
exports.getStreamByName = getStreamByName;
//# sourceMappingURL=getStreamByName.js.map