import { OutboxPostEndpoint } from '.';
import {
  AP,
  assertExists,
  assertIsApActivity,
  assertIsApActor,
} from 'activitypub-core-types';
import {
  isTypeOf,
  getGuid,
  combineAddresses,
  LOCAL_DOMAIN,
} from 'activitypub-core-utilities';
import { compile } from 'path-to-regexp';

export async function respond(this: OutboxPostEndpoint) {
  await this.parseBody();

  assertExists(this.activity);

  await this.getActor();
  await this.authenticateActor();

  assertIsApActor(this.actor);

  const compileOptions = { encode: encodeURIComponent };

  const type = Array.isArray(this.activity.type)
    ? this.activity.type[0]
    : this.activity.type;

  const activityId = new URL(
    `${LOCAL_DOMAIN}${compile(
      this.routes[type.toLowerCase()],
      compileOptions,
    )({
      guid: getGuid(),
    })}`,
  );

  this.activity.id = activityId; // Overwrite ID

  if (isTypeOf(this.activity, AP.ActivityTypes)) {
    assertIsApActivity(this.activity);

    this.activity.url = activityId;

    await this.runSideEffects();
  } else {
    // If not activity type, wrap object in a Create activity.
    await this.wrapInActivity();
  }

  assertIsApActivity(this.activity);

  // Address activity and object the same way.
  this.activity = combineAddresses(this.activity);

  assertExists(this.activity.id);

  await this.saveActivity();

  assertIsApActor(this.actor);

  // Broadcast to Fediverse.
  this.adapters.delivery.broadcast(this.activity, this.actor);

  this.res.statusCode = 201;
  this.res.setHeader('Location', this.activity.id.toString());
  this.res.end();
}
