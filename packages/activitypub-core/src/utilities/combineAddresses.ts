import { AP } from 'activitypub-core-types/src';
import { getId } from './getId';

export function combineAddresses(activity: AP.Activity): AP.Activity {
  if (
    activity.type === AP.ActivityTypes.CREATE &&
    'object' in activity &&
    activity.object &&
    'type' in activity.object
  ) {
    for (const type of Object.values(AP.CoreObjectTypes)) {
      if (type === activity.object.type) {
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
        const objectTo = Array.isArray(activity.object.to)
          ? activity.object.to
          : activity.object.to
            ? [activity.object.to]
            : [];
        const objectCc = Array.isArray(activity.object.cc)
          ? activity.object.cc
          : activity.object.cc
            ? [activity.object.cc]
            : [];
        const objectBto = Array.isArray(activity.object.bto)
          ? activity.object.bto
          : activity.object.bto
            ? [activity.object.bto]
            : [];
        const objectBcc = Array.isArray(activity.object.bcc)
          ? activity.object.bcc
          : activity.object.bcc
            ? [activity.object.bcc]
            : [];
        const objectAudience = Array.isArray(activity.object.audience)
          ? activity.object.audience
            ? activity.object.audience
            : [activity.object.audience]
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

        activity.object.to = to as URL[];
        activity.object.bto = bto as URL[];
        activity.object.cc = cc as URL[];
        activity.object.bcc = bcc as URL[];
        activity.object.audience = audience as URL[];
      }
    }
  }

  return activity;
}
