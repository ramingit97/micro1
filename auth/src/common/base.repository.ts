import { Request } from 'express';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { ENTITY_MANAGER_KEY } from "../interceptors/transaction.interceptor";


export class BaseRepository<T> {
  constructor(private dataSource: DataSource, private request: Request) {}


  protected async saveData(entityCls, data): Promise<T>{
    const entityManager: EntityManager =
      this.request[ENTITY_MANAGER_KEY];

      let res111 = await entityManager.save(entityCls, data) as T;
      
    return res111
  }
}