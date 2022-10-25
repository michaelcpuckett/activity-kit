"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadMediaEndpoint = exports.uploadMediaHandler = void 0;
const getActor_1 = require("./getActor");
const authenticateActor_1 = require("./authenticateActor");
const parseBody_1 = require("./parseBody");
const cleanup_1 = require("./cleanup");
async function uploadMediaHandler(req, res, authenticationService, databaseService, storageService) {
    return await new UploadMediaEndpoint(req, res, authenticationService, databaseService, storageService).handlePost();
}
exports.uploadMediaHandler = uploadMediaHandler;
class UploadMediaEndpoint {
    req;
    res;
    authenticationService;
    databaseService;
    storageService;
    actor = null;
    object = null;
    file = null;
    getActor = getActor_1.getActor;
    authenticateActor = authenticateActor_1.authenticateActor;
    parseBody = parseBody_1.parseBody;
    cleanup = cleanup_1.cleanup;
    constructor(req, res, authenticationService, databaseService, storageService) {
        this.req = req;
        this.res = res;
        this.authenticationService = authenticationService;
        this.databaseService = databaseService;
        this.storageService = storageService;
    }
    async handlePost() {
        try {
            await this.getActor();
            await this.authenticateActor();
            await this.parseBody();
            await this.storageService.upload();
            await this.cleanup();
            await this.databaseService.saveEntity(this.object);
            this.res.statusCode = 201;
            this.res.setHeader('Location', this.object.id.toString());
            this.res.end();
        }
        catch (error) {
            console.log(error);
            this.res.statusCode = 500;
            this.res.write(String(error));
            this.res.end();
        }
    }
}
exports.UploadMediaEndpoint = UploadMediaEndpoint;
//# sourceMappingURL=index.js.map