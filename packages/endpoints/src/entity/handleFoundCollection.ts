import * as AP from '@activity-kit/types';

import { Result } from '../types';
import { EntityGetEndpoint } from '.';

export async function handleFoundCollection(
  this: EntityGetEndpoint,
  entity: AP.EitherCollectionPage,
  render: (entity: AP.Entity) => Promise<string>,
): Promise<Result> {
  return this.handleFoundEntity(entity, render);
}
