import { LOCAL_DOMAIN } from "activitypub-core-utilities";
import { InboxEndpoint } from ".";

export async function saveActivity(this: InboxEndpoint) {
  await this.databaseService.saveEntity(this.activity);

  if (this.activity?.id) {
    const inboxId = `${LOCAL_DOMAIN}${this.req.url}`;
    await this.databaseService.insertOrderedItem(inboxId, this.activity.id);
  }
}