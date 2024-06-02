import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { TokensService } from 'src/tokens/tokens.service';
import { UsersRepo } from 'src/users/repo/user.repo';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly tokenService: TokensService,
    private readonly usersRepo: UsersRepo
  ) {

  }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const ctx = context.switchToHttp()
    const req = ctx.getRequest();

    const refresh_token = req.cookies.refresh_token;
    const access_token = this.extractTokenFromHeader(req);


    

    if (!access_token || !refresh_token) {
      return false
    }

    try {
      await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET")
      })

      let findToken = this.tokenService.findToken(refresh_token)
      if (!findToken) {
        return false
      }

      const user = await this.jwtService.verifyAsync(access_token, {
        secret: this.configService.get<string>("JWT_ACCESS_SECRET")
      })

      const dbUser = await this.usersRepo.findUserById(user.user_id);
      
      if(!dbUser) {
        return false;
      }
      
      req.user = dbUser
    }
    catch (error) {
      return false
    }


    // req.user = { id: 1, name: "RAMINNNNNN", role: 'admin' }
    // console.log('auth guard');

    return true;
  }


  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
