"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routeHandker = void 0;
const oidc_provider_1 = require("oidc-provider");
const client = {
    client_id: 'oidcCLIENT',
    client_secret: 'Some_super_secret',
    grant_types: [
        'authorization_code',
    ],
    redirect_uris: [
        'http://localhost:8080/auth/login/callback',
    ],
    response_types: [
        'code',
    ],
};
const configuration = {
    clients: [
        client,
    ],
    pkce: {
        methods: [],
        required: () => false,
    },
};
const oidc = new oidc_provider_1.Provider('http://localhost:3000', configuration);
exports.routeHandker = oidc.callback();
//# sourceMappingURL=index.js.map