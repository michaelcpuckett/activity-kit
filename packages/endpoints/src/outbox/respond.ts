import { OutboxPostEndpoint } from '.';
import {
  AP,
  isTypeOf,
  assertExists,
  assertIsApActivity,
  assertIsApActor,
  assertIsApEntity,
} from '@activity-kit/types';
import { parseStream, getArray, LOCAL_DOMAIN } from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';

// TODO: Accept Object instead of Activity...

export async function respond(this: OutboxPostEndpoint) {
  const body = await parseStream(this.req);

  assertIsApEntity(body);

  await this.getActor();
  await this.authenticateActor();

  assertIsApActor(this.actor);

  if (isTypeOf<AP.Activity>(body, AP.ActivityTypes)) {
    assertIsApActivity(body);

    this.activity = body;

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
    this.activity = await this.wrapInActivity(body);
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
