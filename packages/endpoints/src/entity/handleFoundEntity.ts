import { EntityGetEndpoint } from '.';
import * as AP from '@activity-kit/types';
import { applyContext, cleanProps } from '@activity-kit/utilities';
import { convertEntityToJson } from '@activity-kit/utilities';

export async function handleFoundEntity(
  this: EntityGetEndpoint,
  entity: AP.Entity,
  render: (...args: unknown[]) => Promise<string>,
) {
  if (this.returnHtml) {
    return {
      statusCode: 200,
      body: await render({
        entity,
      }),
    };
  } else {
    const json = convertEntityToJson(
      cleanProps(applyContext<AP.Entity>(entity)),
    );

    return {
      statusCode: 200,
      body: JSON.stringify(json),
    };
  }
}
