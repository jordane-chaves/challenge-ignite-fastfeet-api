import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Customer } from '@/domain/order/enterprise/entities/customer'
import { User as PrismaUser } from '@prisma/client'

export class PrismaCustomerMapper {
  static toDomain(raw: PrismaUser): Customer {
    return Customer.create(
      {
        name: raw.name,
      },
      new UniqueEntityID(raw.id),
    )
  }
}
