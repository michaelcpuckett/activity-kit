import { AP } from '@activity-kit/types';
import { getId } from './getId';
import { isType, isTypeOf } from './isType';

export function combineAddresses(activity: AP.Activity): AP.Activity {
  if (
    isType(activity, AP.ActivityTypes.CREATE) &&
    'object' in activity &&
    activity.object &&
    'type' in activity.object
  ) {
    const activityObject = activity.object as AP.CoreObject;

    if (isTypeOf(activityObject, AP.CoreObjectTypes)) {
      const activityTo = Array.isArray(activity.to)
        ? activity.to
        : activity.to
        ? [activity.to]
        : [];
      const activityCc = Array.isArray(activity.cc)
        ? activity.cc
        : activity.cc
        ? [activity.cc]
        : [];
      const activityBto = Array.isArray(activity.bto)
        ? activity.bto
        : activity.bto
        ? [activity.bto]
        : [];
      const activityBcc = Array.isArray(activity.bcc)
        ? activity.bcc
        : activity.bcc
        ? [activity.bcc]
        : [];
      const activityAudience = Array.isArray(activity.audience)
        ? activity.audience
        : activity.audience
        ? [activity.audience]
        : [];
      const objectTo = Array.isArray(activityObject.to)
        ? activityObject.to
        : activityObject.to
        ? [activityObject.to]
        : [];
      const objectCc = Array.isArray(activityObject.cc)
        ? activityObject.cc
        : activityObject.cc
        ? [activityObject.cc]
        : [];
      const objectBto = Array.isArray(activityObject.bto)
        ? activityObject.bto
        : activityObject.bto
        ? [activityObject.bto]
        : [];
      const objectBcc = Array.isArray(activityObject.bcc)
        ? activityObject.bcc
        : activityObject.bcc
        ? [activityObject.bcc]
        : [];
      const objectAudience = Array.isArray(activityObject.audience)
        ? activityObject.audience
          ? activityObject.audience
          : [activityObject.audience]
        : [];

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

      activity.to = to as URL[];
      activity.bto = bto as URL[];
      activity.cc = cc as URL[];
      activity.bcc = bcc as URL[];
      activity.audience = audience as URL[];

      activityObject.to = to as URL[];
      activityObject.bto = bto as URL[];
      activityObject.cc = cc as URL[];
      activityObject.bcc = bcc as URL[];
      activityObject.audience = audience as URL[];

      activity.object = activityObject;
    }
  }

  return activity;
}
