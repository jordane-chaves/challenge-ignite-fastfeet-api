import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/account/enterprise/entities/admin'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

export function makeAdmin(
  override: Partial<AdminProps> = {},
  id?: UniqueEntityID,
): Admin {
  const cpf = faker.number
    .int({
      min: 10000000000,
      max: 99999999999,
    })
    .toString()
    .replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4')

  return Admin.create(
    {
      name: faker.person.firstName(),
      cpf: CPF.create(cpf),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )
}

@Injectable()
export class AdminFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAdmin(data: Partial<AdminProps> = {}) {
    const admin = makeAdmin(data)

    await this.prisma.user.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return admin
  }
}
