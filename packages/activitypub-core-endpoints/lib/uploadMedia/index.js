"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadMediaEndpoint = exports.uploadMediaHandler = void 0;
const getActor_1 = require("./getActor");
const authenticateActor_1 = require("./authenticateActor");
const parseBody_1 = require("./parseBody");
async function uploadMediaHandler(req, res, authenticationService, databaseService) {
    return await new UploadMediaEndpoint(req, res, authenticationService, databaseService).handlePost();
}
exports.uploadMediaHandler = uploadMediaHandler;
class UploadMediaEndpoint {
    req;
    res;
    authenticationService;
    databaseService;
    actor = null;
    object = null;
    file = null;
    getActor = getActor_1.getActor;
    authenticateActor = authenticateActor_1.authenticateActor;
    parseBody = parseBody_1.parseBody;
    constructor(req, res, authenticationService, databaseService) {
        this.req = req;
        this.res = res;
        this.authenticationService = authenticationService;
        this.databaseService = databaseService;
    }
    async handlePost() {
        await this.getActor();
        await this.authenticateActor();
        await this.parseBody();
    }
}
exports.UploadMediaEndpoint = UploadMediaEndpoint;
//# sourceMappingURL=index.js.map