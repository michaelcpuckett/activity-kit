import { InboxPostEndpoint } from '.';
import { getId, stringify } from 'activitypub-core-utilities';
import { assertExists } from 'activitypub-core-types';

export async function respond(this: InboxPostEndpoint) {
  await this.parseBody();

  assertExists(this.activity);

  const activityId = getId(this.activity);

  if (activityId) {
    const existingActivity = await this.adapters.db.findEntityById(activityId);

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
    await this.savePeer(actor);

    const isBlocked = await this.isBlocked(actor);

    if (isBlocked) {
      console.log('Blocked from appearing in this inbox.');
      continue;
    }

    await this.adapters.db.insertOrderedItem(actor.inbox, activityId);

    await this.runSideEffects(actor);
  }

  await this.adapters.db.saveEntity(this.activity);
  await this.broadcastActivity();

  this.res.statusCode = 200;
  this.res.end();
}
