import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { ImageFactory } from 'test/factories/make-image'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Deliver Order (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory
  let imageFactory: ImageFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliverymanFactory,
        ImageFactory,
        RecipientFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)
    imageFactory = moduleRef.get(ImageFactory)

    await app.init()
  })

  test('[PATCH] /orders/:id/deliver', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({
      customerId: recipient.id,
      deliverymanId: deliveryman.id,
      postedAt: new Date(),
      withdrawnAt: new Date(),
    })

    const image = await imageFactory.makePrismaImage()

    const accessToken = await jwt.signAsync({
      sub: deliveryman.id.toString(),
      role: 'deliveryman',
    })

    const response = await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        imageId: image.id.toString(),
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
        deliveredAt: expect.any(Date),
      }),
    )
  })
})
