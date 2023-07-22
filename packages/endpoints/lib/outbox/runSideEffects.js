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
async function runSideEffects() {
    try {
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.CREATE)) {
            await this.handleCreate(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.DELETE)) {
            await this.handleDelete(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.ACCEPT)) {
            await this.handleAccept(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.BLOCK)) {
            await this.handleBlock(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.UPDATE)) {
            await this.handleUpdate(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.LIKE)) {
            await this.handleLike(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.ANNOUNCE)) {
            await this.handleAnnounce(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.ADD)) {
            await this.handleAdd(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.REMOVE)) {
            await this.handleRemove(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.FOLLOW)) {
            await this.handleFollow(this.activity);
        }
        if ((0, type_utilities_1.isType)(this.activity, AP.ActivityTypes.UNDO)) {
            await this.handleUndo(this.activity);
        }
    }
    catch (error) {
        console.log(error);
    }
    for (const plugin of this.plugins) {
        if (plugin.handleOutboxSideEffect) {
            try {
                await plugin.handleOutboxSideEffect.call(this);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
}
exports.runSideEffects = runSideEffects;
//# sourceMappingURL=runSideEffects.js.map