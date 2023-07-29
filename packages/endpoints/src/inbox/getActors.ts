import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';

import { InboxPostEndpoint } from '.';

export async function getActors(this: InboxPostEndpoint): Promise<AP.Actor[]> {
  const actor = await this.core.findOne('entity', {
    inbox: this.url.href,
  });

  assert.isApActor(actor);

  return [actor];
}
