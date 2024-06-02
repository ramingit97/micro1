import { ExecutionContext, SetMetadata, createParamDecorator } from '@nestjs/common';

// export const User = (...args: string[]) => SetMetadata('user', args);
export const CurrentUser = createParamDecorator(
    (data: string, ctx: ExecutionContext) => {
      const req = ctx.switchToHttp().getRequest()
      const { user } = req

      console.log('decarator ici ', data, user);
      
  
      if (!user) return null
  
      return data ? user[data] : user
    }
  )
