"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxPostEndpoint = void 0;
const utilities_1 = require("@activity-kit/utilities");
const runSideEffects_1 = require("./runSideEffects");
const wrapInActivity_1 = require("./wrapInActivity");
const combineAddresses_1 = require("./combineAddresses");
const saveActivity_1 = require("./saveActivity");
const getActor_1 = require("./getActor");
const respond_1 = require("./respond");
const delete_1 = require("./sideEffects/delete");
const create_1 = require("./sideEffects/create");
const update_1 = require("./sideEffects/update");
const like_1 = require("./sideEffects/like");
const announce_1 = require("./sideEffects/announce");
const accept_1 = require("./sideEffects/accept");
const block_1 = require("./sideEffects/block");
const add_1 = require("./sideEffects/add");
const undo_1 = require("./sideEffects/undo");
const remove_1 = require("./sideEffects/remove");
const follow_1 = require("./sideEffects/follow");
const undoBlock_1 = require("./sideEffects/undo/undoBlock");
const undoFollow_1 = require("./sideEffects/undo/undoFollow");
const undoAccept_1 = require("./sideEffects/undo/undoAccept");
const undoLike_1 = require("./sideEffects/undo/undoLike");
const undoAnnounce_1 = require("./sideEffects/undo/undoAnnounce");
class OutboxPostEndpoint {
    core;
    body;
    url;
    routes;
    plugins;
    actor;
    activity = null;
    constructor(core, options) {
        this.core = core;
        this.core = core;
        this.actor = options.actor;
        this.body = (0, utilities_1.convertJsonToEntity)(options.body);
        this.url = options.url;
        this.routes = options.routes;
        this.plugins = options.plugins || [];
    }
    getActor = getActor_1.getActor;
    runSideEffects = runSideEffects_1.runSideEffects;
    saveActivity = saveActivity_1.saveActivity;
    wrapInActivity = wrapInActivity_1.wrapInActivity;
    combineAddresses = combineAddresses_1.combineAddresses;
    respond = respond_1.respond;
    handleAdd = add_1.handleAdd;
    handleAnnounce = announce_1.handleAnnounce;
    handleAccept = accept_1.handleAccept;
    handleBlock = block_1.handleBlock;
    handleCreate = create_1.handleCreate;
    handleDelete = delete_1.handleDelete;
    handleLike = like_1.handleLike;
    handleRemove = remove_1.handleRemove;
    handleUpdate = update_1.handleUpdate;
    handleFollow = follow_1.handleFollow;
    handleUndo = undo_1.handleUndo;
    handleUndoLike = undoLike_1.handleUndoLike;
    handleUndoFollow = undoFollow_1.handleUndoFollow;
    handleUndoAccept = undoAccept_1.handleUndoAccept;
    handleUndoAnnounce = undoAnnounce_1.handleUndoAnnounce;
    handleUndoBlock = undoBlock_1.handleUndoBlock;
}
exports.OutboxPostEndpoint = OutboxPostEndpoint;
//# sourceMappingURL=index.js.map