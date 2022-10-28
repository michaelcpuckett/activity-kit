import { LOCAL_DOMAIN } from "activitypub-core-utilities";
import { InboxPostEndpoint } from ".";

export async function saveActivity(this: InboxPostEndpoint) {
  await this.adapters.database.saveEntity(this.activity);

  if (this.activity?.id) {
    const inboxId = `${LOCAL_DOMAIN}${this.req.url}`;
    await this.adapters.database.insertOrderedItem(inboxId, this.activity.id);
  }
}