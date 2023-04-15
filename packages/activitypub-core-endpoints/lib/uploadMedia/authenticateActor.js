"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateActor = void 0;
const cookie_1 = __importDefault(require("cookie"));
async function authenticateActor() {
    const cookies = cookie_1.default.parse(this.req.headers.cookie ?? '');
    const actor = await this.layers.data.getActorByUserId(await this.layers.auth.getUserIdByToken(cookies.__session ?? ''));
    if (!actor || actor.id.toString() !== this.actor?.id?.toString()) {
        throw new Error('Not authorized.');
    }
}
exports.authenticateActor = authenticateActor;
//# sourceMappingURL=authenticateActor.js.map