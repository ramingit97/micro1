import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch()
export class RpcExceptionFilter<T> implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    
    return throwError(() => exception.getError());
  
  }
}