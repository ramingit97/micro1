import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(private reflector: Reflector) {

    }

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {

        const ctx = context.switchToHttp()
        const req = ctx.getRequest();
        const { user } = req
        const roles = this.reflector.get<string[]>('role', context.getHandler());
        // const time = this.reflector.get<string[]>('time', context.getClass());
        // console.log('TIME: ', time);

        // console.log(roles, user.role);
        

        if(roles.includes(user.role)) {
            return true;
        }

        return false;
    }
}
