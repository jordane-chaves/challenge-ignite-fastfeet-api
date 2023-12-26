import { CustomersRepository } from '@/domain/order/application/repositories/customers-repository'
import { Customer } from '@/domain/order/enterprise/entities/customer'
import { Injectable } from '@nestjs/common'

import { PrismaCustomerMapper } from '../mappers/prisma-customer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaCustomersRepository implements CustomersRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.user.findUnique({
      where: {
        id,
      },
    })

    if (!customer) {
      return null
    }

    return PrismaCustomerMapper.toDomain(customer)
  }
}
