import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '@prisma/client';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): User => {
    const { req } = GqlExecutionContext.create(ctx).getContext<{
      req: Request;
    }>();
    return req.user as User;
  },
);
