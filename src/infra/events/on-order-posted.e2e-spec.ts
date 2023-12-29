import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'
import { waitFor } from 'test/utils/wait-for'

import { DomainEvents } from '@/core/events/domain-events'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

import { PrismaService } from '../database/prisma/prisma.service'

describe('On Order Posted (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
  let adminFactory: AdminFactory
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AdminFactory,
        DeliverymanFactory,
        RecipientFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when order is posted', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({
      customerId: recipient.id,
      deliverymanId: deliveryman.id,
      withdrawnAt: new Date(),
    })

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/post`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: recipient.id.toString(),
        },
      })

      expect(notificationOnDatabase).not.toBeNull()
    })
  })
})
