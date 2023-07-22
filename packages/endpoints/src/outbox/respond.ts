import { OutboxPostEndpoint } from '.';
import * as AP from '@activity-kit/types';
import {
  isTypeOf,
  assertExists,
  assertIsApActivity,
  assertIsApActor,
  assertIsApEntity,
} from '@activity-kit/type-utilities';
import { getArray, LOCAL_DOMAIN } from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';

export async function respond(this: OutboxPostEndpoint) {
  assertIsApEntity(this.body);

  await this.getActor();

  assertIsApActor(this.actor);

  if (isTypeOf<AP.Activity>(this.body, AP.ActivityTypes)) {
    assertIsApActivity(this.body);

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

  assertIsApActivity(this.activity);

  assertExists(this.activity.id);

  await this.saveActivity();

  assertIsApActor(this.actor);

  // Broadcast to Fediverse.
  this.core.broadcast(this.activity, this.actor);

  return {
    statusCode: 201,
    contentType: 'application/activity+json',
    location: this.activity.id.toString(),
  };
}
