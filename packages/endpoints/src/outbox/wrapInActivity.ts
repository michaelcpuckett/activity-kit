import { OutboxPostEndpoint } from '.';
import * as AP from '@activity-kit/types';
import { assert } from '@activity-kit/type-utilities';
import { LOCAL_DOMAIN, getId, applyContext } from '@activity-kit/utilities';
import { compile } from 'path-to-regexp';

export async function wrapInActivity(
  this: OutboxPostEndpoint,
  body: AP.Entity,
): Promise<AP.Create> {
  const id = new URL(
    `${LOCAL_DOMAIN}${compile(this.routes.create, {
      encode: encodeURIComponent,
    })({
      guid: await this.core.getGuid(),
    })}`,
  );

  const actorId = getId(this.actor);

  assert.exists(actorId);

  return applyContext<AP.Create>(
    this.combineAddresses({
      id,
      url: id,
      type: AP.ActivityTypes.CREATE,
      actor: actorId,
      object: body,
    }),
  );
}
