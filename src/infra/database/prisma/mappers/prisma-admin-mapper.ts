import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/account/enterprise/entities/admin'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaUser): Admin {
    return Admin.create(
      {
        name: raw.name,
        cpf: CPF.create(raw.cpf),
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.UserUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf.value,
      password: admin.password,
      role: 'ADMIN',
    }
  }
}
