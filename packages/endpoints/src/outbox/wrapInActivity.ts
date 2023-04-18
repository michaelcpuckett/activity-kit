import { OutboxPostEndpoint } from '.';
import {
  LOCAL_DOMAIN,
  combineAddresses,
  getArray,
} from '@activity-kit/utilities';
import { AP } from '@activity-kit/types';
import { compile } from 'path-to-regexp';

export async function wrapInActivity(
  this: OutboxPostEndpoint,
  body: AP.Entity,
) {
  this.activity = combineAddresses({
    type: AP.ActivityTypes.CREATE,
    actor: this.actor.id,
    object: body,
  });

  const [type] = getArray(this.activity.type);

  const activityId = new URL(
    `${LOCAL_DOMAIN}${compile(this.routes[type.toLowerCase()], {
      encode: encodeURIComponent,
    })({
      guid: await this.core.getGuid(),
    })}`,
  );

  this.activity.id = activityId; // Overwrite ID
  this.activity.url = activityId;

  await this.handleCreate(this.activity);
}
