import { InboxPostEndpoint } from '.';
import { getId } from '@activity-kit/utilities';
import { assertExists } from '@activity-kit/types';

export async function respond(this: InboxPostEndpoint) {
  await this.parseBody();

  assertExists(this.activity);

  const activityId = getId(this.activity);

  if (activityId) {
    const existingActivity = await this.core.findEntityById(activityId);

    if (existingActivity) {
      console.log(
        'We have already received this activity. Assuming it was forwarded by another server.',
      );
      this.res.statusCode = 200;
      this.res.end();
      return;
    }
  }

  for (const actor of await this.getActors()) {
    const isBlocked = await this.isBlocked(actor);

    if (isBlocked) {
      console.log('Blocked from appearing in this inbox.');
      continue;
    }

    await this.core.insertOrderedItem(getId(actor.inbox), activityId);

    await this.runSideEffects(actor);
  }

  await this.core.saveEntity(this.activity);
  await this.broadcastActivity();

  this.res.statusCode = 200;
  this.res.end();
}
