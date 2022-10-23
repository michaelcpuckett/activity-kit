import { SharedInboxEndpoint } from ".";

export async function saveActivity(this: SharedInboxEndpoint) {
  const recipientInboxIds = await this.getRecipientInboxIds();

  for (const recipientInboxId of recipientInboxIds) {
    if (!recipientInboxId) {
      continue;
    }

    await this.databaseService.insertOrderedItem(recipientInboxId, this.activity.id);
  }

  await this.databaseService.saveEntity(this.activity);
}