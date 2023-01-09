import { InboxPostEndpoint } from '.';
import { getId, stringify } from 'activitypub-core-utilities';

export async function respond(this: InboxPostEndpoint) {
  await this.parseBody();

  const activityId = getId(this.activity);

  if (activityId) {
    const existingActivity = await this.adapters.db.findEntityById(getId(this.activity)) ?? await this.adapters.db.findOne('foreign-entity', {
      id: activityId.toString(),
    });

    if (existingActivity) {
      console.log('We have already received this activity. Assuming it was forwarded by another server.');
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

    await this.adapters.db.insertOrderedItem(
      actor.inbox,
      getId(this.activity),
    );

    await this.runSideEffects(actor);
  }

  await this.adapters.db.saveEntity(this.activity);
  await this.broadcastActivity();

  this.res.statusCode = 200;
  this.res.write(stringify(this.activity));
  this.res.end();
}