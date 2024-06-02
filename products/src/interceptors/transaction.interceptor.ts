import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';

export const ENTITY_MANAGER_KEY = 'ENTITY_MANAGER';
export const asyncLocalStorage = new AsyncLocalStorage();

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private dataSource: DataSource) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const store = new Map();
    store.set(ENTITY_MANAGER_KEY, queryRunner.manager);

    return asyncLocalStorage.run(store, () => {
      return next.handle().pipe(
        concatMap(async (data) => {
          await queryRunner.commitTransaction();
          return data;
        }),
        catchError(async (error) => {
          await queryRunner.rollbackTransaction();
          throw error;
        }),
        finalize(async () => {
          await queryRunner.release();
        }),
      );
    });
  }
}
