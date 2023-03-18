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
exports.respond = void 0;
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const activitypub_core_types_1 = require("activitypub-core-types");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function respond() {
    const url = this.req.url ?? '';
    const version = parseFloat(url.split('nodeinfo/')[1]);
    const getTotalUsers = async () => {
        const persons = await this.adapters.db.findAll('entity', {
            type: activitypub_core_types_1.AP.ActorTypes.PERSON,
        });
        const groups = await this.adapters.db.findAll('entity', {
            type: activitypub_core_types_1.AP.ActorTypes.GROUP,
        });
        return persons.length + groups.length;
    };
    const getSoftwareVersion = async () => {
        const packageJson = await new Promise((resolve, reject) => {
            fs.readFile(path.resolve(__dirname, '../../package.json'), (err, data) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(JSON.parse(data.toString()));
                }
            });
        });
        if (packageJson.version) {
            return `${packageJson.version}`;
        }
        return '';
    };
    if (version === 2) {
        this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JSON_CONTENT_TYPE);
        this.res.statusCode = 200;
        this.res.write(JSON.stringify({
            version: '2.0',
            openRegistrations: true,
            protocols: ['activitypub'],
            software: {
                name: 'activitypub-core',
                version: await getSoftwareVersion(),
            },
            services: {
                inbound: [],
                outbound: [],
            },
            usage: {
                users: {
                    total: await getTotalUsers(),
                },
            },
            metadata: {},
        }));
    }
    else if (version === 2.1) {
        this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JSON_CONTENT_TYPE);
        this.res.statusCode = 200;
        this.res.write(JSON.stringify({
            version: '2.1',
            openRegistrations: true,
            protocols: ['activitypub'],
            software: {
                name: 'activitypub-core',
                repository: 'https://github.com/michaelcpuckett/activitypub-core',
                version: await getSoftwareVersion(),
            },
            services: {
                inbound: [],
                outbound: [],
            },
            usage: {
                users: {
                    total: await getTotalUsers(),
                },
            },
            metadata: {},
        }));
    }
    else if (!version) {
        this.res.setHeader(activitypub_core_utilities_1.CONTENT_TYPE_HEADER, activitypub_core_utilities_1.JSON_CONTENT_TYPE);
        this.res.statusCode = 200;
        this.res.write(JSON.stringify({
            links: [
                {
                    href: `${activitypub_core_utilities_1.LOCAL_DOMAIN}/nodeinfo/2.0`,
                    rel: `http://nodeinfo.diaspora.software/ns/schema/2.0`,
                },
                {
                    href: `${activitypub_core_utilities_1.LOCAL_DOMAIN}/nodeinfo/2.1`,
                    rel: `http://nodeinfo.diaspora.software/ns/schema/2.1`,
                },
            ],
        }));
    }
    else {
        this.res.statusCode = 404;
    }
    this.res.end();
}
exports.respond = respond;
//# sourceMappingURL=respond.js.map