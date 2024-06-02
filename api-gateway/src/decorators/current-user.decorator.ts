import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext):any => {
    const request = context.switchToHttp().getRequest();
    return request.user; // Предполагается, что пользователь был добавлен в объект запроса в мидлваре аутентификации
  },
);