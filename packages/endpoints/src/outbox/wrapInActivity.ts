import { OutboxPostEndpoint } from '.';
import { LOCAL_DOMAIN, applyContext } from '@activity-kit/utilities';
import { AP } from '@activity-kit/types';
import { compile } from 'path-to-regexp';

export async function wrapInActivity(
  this: OutboxPostEndpoint,
  body: AP.Entity,
): Promise<AP.Activity> {
  const id = new URL(
    `${LOCAL_DOMAIN}${compile(this.routes.create, {
      encode: encodeURIComponent,
    })({
      guid: await this.core.getGuid(),
    })}`,
  );

  return applyContext<AP.Activity>(
    this.combineAddresses({
      id,
      url: id,
      type: AP.ActivityTypes.CREATE,
      actor: this.actor.id,
      object: body,
    }),
  );
}
