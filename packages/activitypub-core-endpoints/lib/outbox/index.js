"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OutboxPostEndpoint = void 0;
const activitypub_core_types_1 = require("activitypub-core-types");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const runSideEffects_1 = require("./runSideEffects");
const authenticateActor_1 = require("./authenticateActor");
const wrapInActivity_1 = require("./wrapInActivity");
const saveActivity_1 = require("./saveActivity");
const parseBody_1 = require("./parseBody");
const getActor_1 = require("./getActor");
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
const undoBlock_1 = require("./sideEffects/undo/undoBlock");
const undoLike_1 = require("./sideEffects/undo/undoLike");
const undoAnnounce_1 = require("./sideEffects/undo/undoAnnounce");
class OutboxPostEndpoint {
    req;
    res;
    adapters;
    plugins;
    actor = null;
    activity = null;
    constructor(req, res, adapters, plugins) {
        this.req = req;
        this.res = res;
        this.adapters = adapters;
        this.plugins = plugins;
    }
    async respond() {
        try {
            await this.parseBody();
            await this.getActor();
            await this.authenticateActor();
            const activityId = new URL(`${activitypub_core_utilities_1.LOCAL_DOMAIN}/entity/${(0, activitypub_core_utilities_1.getGuid)()}`);
            this.activity.id = activityId;
            if ((0, activitypub_core_utilities_1.isTypeOf)(this.activity, activitypub_core_types_1.AP.ActivityTypes)) {
                this.activity.url = activityId;
                await this.runSideEffects();
            }
            else {
                await this.wrapInActivity();
            }
            this.activity = (0, activitypub_core_utilities_1.combineAddresses)(this.activity);
            await this.saveActivity();
            if (!this.activity.id) {
                throw new Error('Bad activity: No ID.');
            }
            await this.adapters.delivery.broadcast(this.activity, this.actor);
            this.res.statusCode = 201;
            this.res.setHeader('Location', this.activity.id.toString());
            this.res.end();
        }
        catch (error) {
            console.log(error);
            this.res.statusCode = 500;
            this.res.write(String(error));
            this.res.end();
        }
    }
    authenticateActor = authenticateActor_1.authenticateActor;
    getActor = getActor_1.getActor;
    runSideEffects = runSideEffects_1.runSideEffects;
    saveActivity = saveActivity_1.saveActivity;
    wrapInActivity = wrapInActivity_1.wrapInActivity;
    parseBody = parseBody_1.parseBody;
    handleAdd = add_1.handleAdd;
    handleAnnounce = announce_1.handleAnnounce;
    handleAccept = accept_1.handleAccept;
    handleBlock = block_1.handleBlock;
    handleCreate = create_1.handleCreate;
    handleDelete = delete_1.handleDelete;
    handleLike = like_1.handleLike;
    handleRemove = remove_1.handleRemove;
    handleUpdate = update_1.handleUpdate;
    handleUndo = undo_1.handleUndo;
    handleUndoLike = undoLike_1.handleUndoLike;
    handleUndoAnnounce = undoAnnounce_1.handleUndoAnnounce;
    handleUndoBlock = undoBlock_1.handleUndoBlock;
}
exports.OutboxPostEndpoint = OutboxPostEndpoint;
//# sourceMappingURL=index.js.map