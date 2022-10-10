import { DatabaseService } from '.';
import { AP } from '../types';

export async function queryById(
  this: DatabaseService,
  id: URL,
): Promise<AP.Entity | null> {
  try {
    return (await this.findEntityById(id)) ?? (await this.fetchEntityById(id));
  } catch (error: unknown) {
    throw new Error(String(error));
  }
}
