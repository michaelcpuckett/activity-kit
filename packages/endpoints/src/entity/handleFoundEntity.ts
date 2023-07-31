import * as AP from '@activity-kit/types';
import {
  applyContext,
  cleanProps,
  convertEntityToJson,
} from '@activity-kit/utilities';

import { Result } from '../types';
import { EntityGetEndpoint } from '.';

export async function handleFoundEntity(
  this: EntityGetEndpoint,
  entity: AP.Entity,
  render: (entity: AP.Entity) => Promise<string>,
): Promise<Result> {
  if (this.returnHtml) {
    const expandedEntity = await this.core.expandEntity(entity);

    return {
      statusCode: 200,
      body: await render(expandedEntity),
    };
  }

  const json = convertEntityToJson(cleanProps(applyContext(entity)));

  return {
    statusCode: 200,
    body: JSON.stringify(json),
  };
}
