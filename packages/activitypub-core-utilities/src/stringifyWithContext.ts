import { AP } from 'activitypub-core-types';
import { addContext } from "./addContext";
import { cleanProps } from "./cleanProps";
import { convertUrlsToStrings } from "./convertUrlsToStrings";

export function stringifyWithContext(entity: AP.Entity) {
  return JSON.stringify(convertUrlsToStrings(addContext(cleanProps(entity))));
}