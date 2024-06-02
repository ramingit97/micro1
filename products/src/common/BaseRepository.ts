import { DataSource, EntityManager } from 'typeorm';
import { asyncLocalStorage, ENTITY_MANAGER_KEY } from '../interceptors/transaction.interceptor';

export class BaseRepository {
  constructor(public dataSource: DataSource) {}

  protected async saveData(entityCls: any, data: any): Promise<any> {
    const store:any = asyncLocalStorage.getStore();
    if (!store) {
      throw new Error('No active transaction context found');
    }
    const entityManager: EntityManager = store.get(ENTITY_MANAGER_KEY);
    if (!entityManager) {
      throw new Error('No EntityManager found in the transaction context');
    }

    return await entityManager.save(entityCls, data);
  }
}
