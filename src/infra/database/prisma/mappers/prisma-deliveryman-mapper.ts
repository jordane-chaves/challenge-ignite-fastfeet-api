import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'
import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { Prisma, User as PrismaUser } from '@prisma/client'

export class PrismaDeliverymanMapper {
  static toDomain(raw: PrismaUser): Deliveryman {
    return Deliveryman.create(
      {
        name: raw.name,
        cpf: CPF.create(raw.cpf),
        password: raw.password,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrismaUpdate(deliveryman: Deliveryman): Prisma.UserUpdateArgs {
    return {
      where: {
        id: deliveryman.id.toString(),
      },
      data: {
        name: deliveryman.name,
        cpf: deliveryman.cpf.value,
        password: deliveryman.password,
      },
    }
  }

  static toPrisma(deliveryman: Deliveryman): Prisma.UserUncheckedCreateInput {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      cpf: deliveryman.cpf.value,
      password: deliveryman.password,
      role: 'DELIVERYMAN',
    }
  }
}
