import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Observable, throwError } from 'rxjs';

@Catch(HttpException)
export class HttpExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();

    const status = exception instanceof HttpException?
      exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let responseError = null
    if(exception instanceof HttpException){
      responseError = exception.getResponse();
    }

    return throwError(() => exception);

  }
}