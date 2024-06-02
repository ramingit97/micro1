import {
  Injectable,
  Inject,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject('AUTH_SERVICE') private readonly userServiceClient: ClientProxy,
    @Inject(CACHE_MANAGER) private cacheService: Cache,
  ) { }





  public async canActivate(context: ExecutionContext): Promise<boolean> {

    try {
      // const secured = this.reflector.get<string[]>(
      //   'secured',
      //   context.getClass(),
      // );
      // console.log('Is Secured ', secured);


      // if (!secured) {
      //   return true;
      // }

      const request = context.switchToHttp().getRequest();
      const refresh_token = request.cookies.refresh_token;
      const access_token = this.extractTokenFromHeader(request);


      const cachedData = await this.cacheService.get(
        access_token
      );


      if (cachedData) {
        request.user = cachedData;
        return true;
      }




      const userInfo = await firstValueFrom(
        this.userServiceClient.send('token_decode', {
          access_token,
          refresh_token
        }),
      );


      if (!userInfo) {
        throw new HttpException(
          {
            message: userInfo.message,
            data: null,
            errors: null,
          },
          userInfo.status,
        );
      }

      request.user = userInfo;
      await this.cacheService.set(access_token, userInfo, 60 * 60) // 1 saat
      return true;
    } catch (e) {
      console.log('errrr aughtguard ', e);
      return false
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
