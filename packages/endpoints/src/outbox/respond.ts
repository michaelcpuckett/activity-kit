import { OutboxPostEndpoint } from '.';
import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import { getArray, LOCAL_DOMAIN } from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';

export async function respond(this: OutboxPostEndpoint) {
  assert.isApEntity(this.body);

  await this.getActor();

  assert.isApActor(this.actor);

  if (guard.isTypeOf<AP.Activity>(this.body, AP.ActivityTypes)) {
    assert.isApActivity(this.body);

    this.activity = this.body;

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

    // Address activity and object the same way.
    this.activity = this.combineAddresses(this.activity);

    await this.runSideEffects();
  } else {
    // If not activity type, wrap object in a Create activity.
    this.activity = await this.wrapInActivity(this.body);

    await this.handleCreate(this.activity);
  }

  assert.isApActivity(this.activity);

  assert.exists(this.activity.id);

  await this.saveActivity();

  assert.isApActor(this.actor);

  // Broadcast to Fediverse.
  this.core.broadcast(this.activity, this.actor);

  return {
    statusCode: 201,
    contentType: 'application/activity+json',
    location: this.activity.id.toString(),
  };
}
