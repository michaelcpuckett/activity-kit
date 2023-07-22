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
exports.parseBody = void 0;
const utilities_1 = require("@activity-kit/utilities");
const formidable = __importStar(require("formidable"));
const path_to_regexp_1 = require("path-to-regexp");
const AP = __importStar(require("@activity-kit/types"));
const type_utilities_1 = require("@activity-kit/type-utilities");
async function parseBody() {
    const form = formidable.default({
        multiples: true,
    });
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(this.req, (err, fields, files) => {
            if (err) {
                reject(err);
            }
            else {
                resolve({
                    fields,
                    files,
                });
            }
        });
    });
    if (typeof fields.object === 'string' &&
        files.file &&
        !Array.isArray(files.file)) {
        this.file = files.file;
        const activityId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes.create)({
            guid: await this.core.getGuid(),
        })}`);
        const objectId = new URL(`${utilities_1.LOCAL_DOMAIN}${(0, path_to_regexp_1.compile)(this.routes[getType(this.file.mimetype).toLowerCase()])({
            guid: await this.core.getGuid(),
        })}`);
        const object = (0, utilities_1.applyContext)({
            to: new URL(utilities_1.PUBLIC_ACTOR),
            type: getType(this.file.mimetype),
            mediaType: this.file.mimetype,
            ...JSON.parse(fields.object),
            id: objectId,
            attributedTo: this.actor.id,
        });
        const activity = (0, utilities_1.applyContext)({
            to: new URL(utilities_1.PUBLIC_ACTOR),
            type: AP.ActivityTypes.CREATE,
            id: activityId,
            url: activityId,
            actor: this.actor.id,
            object,
        });
        (0, type_utilities_1.assertIsApTransitiveActivity)(activity);
        this.activity = activity;
    }
}
exports.parseBody = parseBody;
function getType(mimeType) {
    if (mimeType.startsWith('image')) {
        return 'Image';
    }
    if (mimeType.startsWith('video')) {
        return 'Video';
    }
    if (mimeType.startsWith('audio')) {
        return 'Audio';
    }
    return 'Document';
}
//# sourceMappingURL=parseBody.js.map