import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { CustomersRepository } from '@/domain/order/application/repositories/customers-repository'
import { ImagesRepository } from '@/domain/order/application/repositories/images-repository'
import { OrdersRepository } from '@/domain/order/application/repositories/orders-repository'
import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customers-repository'
import { PrismaImagesRepository } from './prisma/repositories/prisma-images-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'

@Module({
  providers: [
    PrismaService,
    {
      provide: AdminsRepository,
      useClass: PrismaAdminsRepository,
    },
    {
      provide: CustomersRepository,
      useClass: PrismaCustomersRepository,
    },
    {
      provide: OrdersRepository,
      useClass: PrismaOrdersRepository,
    },
    {
      provide: ImagesRepository,
      useClass: PrismaImagesRepository,
    },
  ],
  exports: [
    AdminsRepository,
    CustomersRepository,
    ImagesRepository,
    PrismaService,
    OrdersRepository,
  ],
})
export class DatabaseModule {}
