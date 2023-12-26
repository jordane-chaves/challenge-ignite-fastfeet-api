import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

import { UserPayload } from '../authentication/jwt.strategy'
import { ROLES_KEY } from './roles'
import { UserRoles } from './user-roles'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    )

    if (!requiredRoles) {
      return true
    }

    const user = context.switchToHttp().getRequest().user as UserPayload
    return requiredRoles.some((role) => user.role?.includes(role))
  }
}
