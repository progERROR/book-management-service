import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRole = this.reflector.get<string>('role', context.getHandler());
    if (!requiredRole) return true;

    const gqlContext = GqlExecutionContext.create(context);
    const user = gqlContext.getContext().req.user;

    if (!user || user.role !== requiredRole) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
