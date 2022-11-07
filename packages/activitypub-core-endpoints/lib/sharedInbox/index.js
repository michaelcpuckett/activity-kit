"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedInboxPostEndpoint = void 0;
const inbox_1 = require("../inbox");
const getActors_1 = require("./getActors");
const broadcastActivity_1 = require("./broadcastActivity");
class SharedInboxPostEndpoint extends inbox_1.InboxPostEndpoint {
    getActors = getActors_1.getActors;
    broadcastActivity = broadcastActivity_1.broadcastActivity;
}
exports.SharedInboxPostEndpoint = SharedInboxPostEndpoint;
//# sourceMappingURL=index.js.map