import { AP } from "../types";
import { stringify } from 'superjson';

export const convertUrlsToStrings = (entity: AP.Entity): AP.Entity => {
  return JSON.parse(stringify(entity)).json;
}