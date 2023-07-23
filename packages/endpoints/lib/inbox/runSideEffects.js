"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSideEffects = void 0;
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
async function runSideEffects(recipient) {
    for (const plugin of this.plugins) {
        if (plugin.handleInboxSideEffect) {
            try {
                await plugin.handleInboxSideEffect.call(this, this.activity, recipient);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    try {
        if (type_utilities_1.guard.isType(this.activity, AP.ActivityTypes.CREATE)) {
            await this.handleCreate(this.activity, recipient);
        }
        if (type_utilities_1.guard.isType(this.activity, AP.ActivityTypes.FOLLOW)) {
            await this.handleFollow(this.activity, recipient);
        }
        if (type_utilities_1.guard.isType(this.activity, AP.ActivityTypes.ACCEPT)) {
            await this.handleAccept(this.activity, recipient);
        }
        if (type_utilities_1.guard.isType(this.activity, AP.ActivityTypes.LIKE)) {
            await this.handleLike(this.activity, recipient);
        }
        if (type_utilities_1.guard.isType(this.activity, AP.ActivityTypes.ANNOUNCE)) {
            await this.handleAnnounce(this.activity, recipient);
        }
    }
    catch (error) {
        console.log(error);
    }
}
exports.runSideEffects = runSideEffects;
//# sourceMappingURL=runSideEffects.js.map