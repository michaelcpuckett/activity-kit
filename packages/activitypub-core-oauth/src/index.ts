import { Provider } from 'oidc-provider';
import type { Configuration, ClientMetadata } from 'oidc-provider';
import { LOCAL_DOMAIN } from 'activitypub-core-utilities';

export const oidcRouteHandler = ({
  client_id,
  client_secret,
  redirect_uris
}) => {
  const client: ClientMetadata = {
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

  const configuration: Configuration = {
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

  const oidc = new Provider(LOCAL_DOMAIN, configuration);

  return oidc.callback();
};