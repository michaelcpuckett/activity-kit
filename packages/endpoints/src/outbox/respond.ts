import { OutboxPostEndpoint } from '.';
import {
  AP,
  isTypeOf,
  assertExists,
  assertIsApActivity,
  assertIsApActor,
} from '@activity-kit/types';
import {
  combineAddresses,
  getArray,
  LOCAL_DOMAIN,
} from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';

export async function respond(this: OutboxPostEndpoint) {
  await this.parseBody();

  assertExists(this.activity);

  await this.getActor();
  await this.authenticateActor();

  assertIsApActor(this.actor);

  const compileOptions = { encode: encodeURIComponent };

  const [type] = getArray(this.activity.type);

  const activityId = new URL(
    `${LOCAL_DOMAIN}${compile(
      this.routes[type.toLowerCase()],
      compileOptions,
    )({
      guid: await this.core.getGuid(),
    })}`,
  );

  this.activity.id = activityId; // Overwrite ID

  if (isTypeOf<AP.Activity>(this.activity, AP.ActivityTypes)) {
    assertIsApActivity(this.activity);

    this.activity.url = activityId;

    // Address activity and object the same way.
    this.activity = combineAddresses(this.activity);

    await this.runSideEffects();
  } else {
    // If not activity type, wrap object in a Create activity.
    await this.wrapInActivity();
  }

  assertIsApActivity(this.activity);

  assertExists(this.activity.id);

  await this.saveActivity();

  assertIsApActor(this.actor);

  // Broadcast to Fediverse.
  this.core.broadcast(this.activity, this.actor);

  this.res.statusCode = 201;
  this.res.setHeader('Location', this.activity.id.toString());
  this.res.end();
}
