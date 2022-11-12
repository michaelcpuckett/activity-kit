import { Provider } from 'oidc-provider';
import type { Configuration, ClientMetadata } from 'oidc-provider';

const client: ClientMetadata = {
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
}

const configuration: Configuration = {
  clients: [
    client,
  ],
  pkce: {
    methods: [],
    required: () => false,
  },
};

const oidc = new Provider('http://localhost:3000', configuration);

export const routeHandker = oidc.callback();