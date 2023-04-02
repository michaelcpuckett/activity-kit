import { OutboxPostEndpoint } from '.';
import { LOCAL_DOMAIN, combineAddresses } from 'activitypub-core-utilities';
import { AP } from 'activitypub-core-types';
import { compile } from 'path-to-regexp';

export async function wrapInActivity(this: OutboxPostEndpoint) {
  this.activity = combineAddresses({
    type: AP.ActivityTypes.CREATE,
    actor: this.actor.id,
    object: this.activity,
  });

  const compileOptions = { encode: encodeURIComponent };

  const type = Array.isArray(this.activity.type)
    ? this.activity.type[0]
    : this.activity.type;

  const activityId = new URL(
    `${LOCAL_DOMAIN}${compile(
      this.routes[type.toLowerCase()],
      compileOptions,
    )({
      guid: await this.adapters.crypto.randomBytes(16),
    })}`,
  );

  this.activity.id = activityId; // Overwrite ID
  this.activity.url = activityId;

  await this.handleCreate(this.activity);
}
