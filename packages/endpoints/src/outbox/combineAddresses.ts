import { OutboxPostEndpoint } from '.';
import * as AP from '@activity-kit/types';
import { assert, guard } from '@activity-kit/type-utilities';
import { getId, getArray } from '@activity-kit/utilities';

export function combineAddresses(
  this: OutboxPostEndpoint,
  activity: AP.Activity,
): AP.Activity {
  assert.isApTransitiveActivity(activity);

  assert.isApCoreObject(activity.object);

  const getArrayOfIds = (item: AP.OrArray<AP.EntityReference> | undefined) =>
    getArray(item).map(getId).filter<URL>(guard.isUrl);

  const activityTo = getArrayOfIds(activity.to);
  const activityCc = getArrayOfIds(activity.cc);
  const activityBto = getArrayOfIds(activity.bto);
  const activityBcc = getArrayOfIds(activity.bcc);
  const activityAudience = getArrayOfIds(activity.audience);

  const objectTo = getArrayOfIds(activity.object.to);
  const objectCc = getArrayOfIds(activity.object.cc);
  const objectBto = getArrayOfIds(activity.object.bto);
  const objectBcc = getArrayOfIds(activity.object.bcc);
  const objectAudience = getArrayOfIds(activity.object.audience);

  const to = [...new Set([...activityTo, ...objectTo])];
  const bto = [...new Set([...activityBto, ...objectBto])];
  const cc = [...new Set([...activityCc, ...objectCc])];
  const bcc = [...new Set([...activityBcc, ...objectBcc])];
  const audience = [...new Set([...activityAudience, ...objectAudience])];

  activity.to = to;
  activity.bto = bto;
  activity.cc = cc;
  activity.bcc = bcc;
  activity.audience = audience;

  activity.object.to = to;
  activity.object.bto = bto;
  activity.object.cc = cc;
  activity.object.bcc = bcc;
  activity.object.audience = audience;

  return activity;
}
