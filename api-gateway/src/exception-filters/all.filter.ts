import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

@Catch(HttpException)
export class AllExceptionFilter<T> implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('erre',exception)
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();

    const status = exception instanceof HttpException?
      exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;


      // console.log(exception instanceof HttpException? exception.getResponse():'' )
    let responseError = null
    if(exception instanceof HttpException){
      responseError = exception.getResponse();
    }

      

   response.status(status).json({
    status,
    timestamp:  new Date(),
    path:request.path,
    ...responseError
   })   

  }
}