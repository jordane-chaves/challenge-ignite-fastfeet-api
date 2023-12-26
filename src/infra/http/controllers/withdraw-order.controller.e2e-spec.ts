import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Withdraw Order (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[PATCH] /orders/:id/withdraw', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({
      customerId: recipient.id,
      postedAt: new Date(),
    })

    const accessToken = await jwt.signAsync({
      sub: deliveryman.id.toString(),
      role: 'deliveryman',
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/withdraw`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId: recipient.id.toString(),
      })

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        recipientId: recipient.id.toString(),
      },
    })

    expect(orderOnDatabase).toEqual(
      expect.objectContaining({
        deliverymanId: deliveryman.id.toString(),
        withdrawnAt: expect.any(Date),
      }),
    )
  })
})
