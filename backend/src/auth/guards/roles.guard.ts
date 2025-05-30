import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '@prisma/client';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [ctx.getHandler(), ctx.getClass()],
    );
    if (!requiredRoles) return true;

    let req: Request;
    const contextType = ctx.getType();
    if (contextType === 'http') {
      req = ctx.switchToHttp().getRequest<Request>();
    } else {
      req = GqlExecutionContext.create(ctx).getContext<{
        req: Request;
      }>().req;
    }

    const user = req.user as User;
    return Boolean(user) && requiredRoles.includes(user.role);
  }
}
