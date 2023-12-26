import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'
import { Prisma } from '@prisma/client'

export class PrismaDeliverymanMapper {
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
