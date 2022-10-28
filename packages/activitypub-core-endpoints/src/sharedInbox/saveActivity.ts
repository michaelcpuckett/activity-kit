import { SharedInboxPostEndpoint } from '.';
import { InboxPostEndpoint } from '../inbox';

export async function saveActivity(
  this: InboxPostEndpoint & SharedInboxPostEndpoint,
) {
  const recipientInboxIds = await this.getRecipientInboxIds();

  for (const recipientInboxId of recipientInboxIds) {
    if (!recipientInboxId) {
      continue;
    }

    await this.adapters.db.insertOrderedItem(
      recipientInboxId,
      this.activity.id,
    );
  }

  await this.adapters.db.saveEntity(this.activity);
}
