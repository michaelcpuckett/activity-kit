import { AP, isTypeOf } from '@activity-kit/types';
import { getId } from './getId';
import { getArray } from './getArray';

export function combineAddresses(activity: AP.Activity): AP.Activity {
  if ('object' in activity) {
    const activityObject = activity.object;

    if (isTypeOf<AP.CoreObject>(activityObject, AP.CoreObjectTypes)) {
      const activityTo = getArray(activity.to);
      const activityCc = getArray(activity.cc);
      const activityBto = getArray(activity.bto);
      const activityBcc = getArray(activity.bcc);
      const activityAudience = getArray(activity.audience);
      const objectTo = getArray(activityObject.to);
      const objectCc = getArray(activityObject.cc);
      const objectBto = getArray(activityObject.bto);
      const objectBcc = getArray(activityObject.bcc);
      const objectAudience = getArray(activityObject.audience);

      const to = [...new Set([...activityTo, ...objectTo].map(getId))].filter(
        (item) => item,
      );
      const bto = [
        ...new Set([...activityBto, ...objectBto].map(getId)),
      ].filter((item) => item);
      const cc = [...new Set([...activityCc, ...objectCc].map(getId))].filter(
        (item) => item,
      );
      const bcc = [
        ...new Set([...activityBcc, ...objectBcc].map(getId)),
      ].filter((item) => item);
      const audience = [
        ...new Set([...activityAudience, ...objectAudience].map(getId)),
      ].filter((item) => item);

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
