import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // For debugging
    console.log('User in decorator:', user);

    // Handle the case where data is 'id' but user.id is undefined and user.sub exists
    if (data === 'id' && !user?.id && user?.sub) {
      return user.sub;
    }

    return data ? user?.[data] : user;
  },
);
