import * as AP from '@activity-kit/types';
import { guard, assert } from '@activity-kit/type-utilities';
import { getArray, getId, LOCAL_DOMAIN } from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';

import { OutboxPostEndpoint } from '.';

export async function respond(this: OutboxPostEndpoint) {
  assert.isApEntity(this.body);

  await this.getActor();

  assert.isApActor(this.actor);

  if (guard.isApActivity(this.body)) {
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

    try {
      await this.runSideEffects();
    } catch (error: unknown) {
      console.error(error);

      return {
        statusCode: 500,
        json: {
          error: `${error}`,
        },
      };
    }
  } else {
    try {
      this.activity = await this.wrapInActivity(this.body);
      await this.handleCreate(this.activity);
    } catch (error: unknown) {
      console.error(error);

      return {
        statusCode: 500,
        json: {
          error: `${error}`,
        },
      };
    }
  }

  assert.isApActivity(this.activity);

  const activityId = getId(this.activity);

  assert.exists(activityId);

  await this.saveActivity();

  assert.isApActor(this.actor);

  // Broadcast to Fediverse.
  this.core.broadcast(this.activity, this.actor);

  return {
    statusCode: 201,
    location: activityId.href,
  };
}
