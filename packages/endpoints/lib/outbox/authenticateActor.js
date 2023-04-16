"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateActor = void 0;
const types_1 = require("@activity-kit/types");
const utilities_1 = require("@activity-kit/utilities");
const cookie_1 = __importDefault(require("cookie"));
async function authenticateActor() {
    const cookies = cookie_1.default.parse(this.req.headers.cookie ?? '');
    const userId = await this.core.getUserIdByToken(cookies.__session ?? '');
    try {
        const authenticatedActor = await this.core.getActorByUserId(userId);
        (0, types_1.assertIsApActor)(authenticatedActor);
        const authenticatedActorId = (0, utilities_1.getId)(authenticatedActor);
        (0, types_1.assertExists)(authenticatedActorId);
        if (authenticatedActorId.toString() !== this.actor.id.toString()) {
            throw new Error('No match.');
        }
    }
    catch (error) {
        throw new Error('Not authorized.');
    }
}
exports.authenticateActor = authenticateActor;
//# sourceMappingURL=authenticateActor.js.map