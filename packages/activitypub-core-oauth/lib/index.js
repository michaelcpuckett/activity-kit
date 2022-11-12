"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.oidcRouteHandler = void 0;
const oidc_provider_1 = require("oidc-provider");
const activitypub_core_utilities_1 = require("activitypub-core-utilities");
const oidcRouteHandler = ({ client_id, client_secret, redirect_uris }) => {
    const client = {
        client_id,
        client_secret,
        grant_types: [
            'authorization_code',
        ],
        redirect_uris,
        response_types: [
            'code',
        ],
    };
    const configuration = {
        clients: [
            client,
        ],
        pkce: {
            methods: [
                'S256',
            ],
            required: () => false,
        },
    };
    const oidc = new oidc_provider_1.Provider(activitypub_core_utilities_1.LOCAL_DOMAIN, configuration);
    return oidc.callback();
};
exports.oidcRouteHandler = oidcRouteHandler;
//# sourceMappingURL=index.js.map