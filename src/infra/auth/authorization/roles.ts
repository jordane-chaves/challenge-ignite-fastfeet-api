import { SetMetadata } from '@nestjs/common'

import { UserRoles } from './user-roles'

export const ROLES_KEY = 'roles'
export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles)
