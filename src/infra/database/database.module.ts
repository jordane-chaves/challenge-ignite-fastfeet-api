import { AdminsRepository } from '@/domain/account/application/repositories/admins-repository'
import { DeliverymenRepository } from '@/domain/account/application/repositories/deliverymen-repository'
import { RecipientAddressesRepository } from '@/domain/account/application/repositories/recipient-addresses-repository'
import { RecipientsRepository } from '@/domain/account/application/repositories/recipients-repository'
import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications-repository'
import { CustomersRepository } from '@/domain/order/application/repositories/customers-repository'
import { ImagesRepository } from '@/domain/order/application/repositories/images-repository'
import { OrdersRepository } from '@/domain/order/application/repositories/orders-repository'
import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAdminsRepository } from './prisma/repositories/prisma-admins-repository'
import { PrismaCustomersRepository } from './prisma/repositories/prisma-customers-repository'
import { PrismaDeliverymenRepository } from './prisma/repositories/prisma-deliverymen-repository'
import { PrismaImagesRepository } from './prisma/repositories/prisma-images-repository'
import { PrismaNotificationsRepository } from './prisma/repositories/prisma-notifications-repository'
import { PrismaOrdersRepository } from './prisma/repositories/prisma-orders-repository'
import { PrismaRecipientAddressesRepository } from './prisma/repositories/prisma-recipient-addresses-repository'
import { PrismaRecipientsRepository } from './prisma/repositories/prisma-recipients-repository'

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
    {
      provide: DeliverymenRepository,
      useClass: PrismaDeliverymenRepository,
    },
    {
      provide: RecipientsRepository,
      useClass: PrismaRecipientsRepository,
    },
    {
      provide: RecipientAddressesRepository,
      useClass: PrismaRecipientAddressesRepository,
    },
    {
      provide: NotificationsRepository,
      useClass: PrismaNotificationsRepository,
    },
  ],
  exports: [
    AdminsRepository,
    CustomersRepository,
    DeliverymenRepository,
    ImagesRepository,
    PrismaService,
    RecipientsRepository,
    RecipientAddressesRepository,
    NotificationsRepository,
    OrdersRepository,
  ],
})
export class DatabaseModule {}
