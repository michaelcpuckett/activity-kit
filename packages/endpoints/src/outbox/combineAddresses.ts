import { OutboxPostEndpoint } from '.';
import { AP, isTypeOf } from '@activity-kit/types';
import { getId, getArray } from '@activity-kit/utilities';

export function combineAddresses(
  this: OutboxPostEndpoint,
  activity: AP.Activity,
): AP.Activity {
  if ('object' in activity) {
    const activityObject = activity.object;

    if (isTypeOf<AP.CoreObject>(activityObject, AP.CoreObjectTypes)) {
      const activityTo = getArray<AP.EntityReference>(activity.to);
      const activityCc = getArray<AP.EntityReference>(activity.cc);
      const activityBto = getArray<AP.EntityReference>(activity.bto);
      const activityBcc = getArray<AP.EntityReference>(activity.bcc);
      const activityAudience = getArray<AP.EntityReference>(activity.audience);
      const objectTo = getArray<AP.EntityReference>(activityObject.to);
      const objectCc = getArray<AP.EntityReference>(activityObject.cc);
      const objectBto = getArray<AP.EntityReference>(activityObject.bto);
      const objectBcc = getArray<AP.EntityReference>(activityObject.bcc);
      const objectAudience = getArray<AP.EntityReference>(
        activityObject.audience,
      );

      const to = [...new Set([...activityTo, ...objectTo].map(getId))].filter(
        (item) => !!item,
      );
      const bto = [
        ...new Set([...activityBto, ...objectBto].map(getId)),
      ].filter((item) => !!item);
      const cc = [...new Set([...activityCc, ...objectCc].map(getId))].filter(
        (item) => !!item,
      );
      const bcc = [
        ...new Set([...activityBcc, ...objectBcc].map(getId)),
      ].filter((item) => !!item);
      const audience = [
        ...new Set([...activityAudience, ...objectAudience].map(getId)),
      ].filter((item) => !!item);

      activity.to = to;
      activity.bto = bto;
      activity.cc = cc;
      activity.bcc = bcc;
      activity.audience = audience;

      activityObject.to = to;
      activityObject.bto = bto;
      activityObject.cc = cc;
      activityObject.bcc = bcc;
      activityObject.audience = audience;

      activity.object = activityObject;
    }
  }

  return activity;
}
