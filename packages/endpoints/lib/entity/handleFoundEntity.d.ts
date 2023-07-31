import * as AP from '@activity-kit/types';
import { EntityGetEndpoint } from '.';
export declare function handleFoundEntity(
  this: EntityGetEndpoint,
  entity: AP.Entity,
  render: (entity: AP.Entity) => Promise<string>,
): Promise<{
  statusCode: number;
  body: string;
}>;
