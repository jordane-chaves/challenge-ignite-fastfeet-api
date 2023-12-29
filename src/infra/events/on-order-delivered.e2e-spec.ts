import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { ImageFactory } from 'test/factories/make-image'
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

describe('On Order Delivered (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService
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
    imageFactory = moduleRef.get(ImageFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    DomainEvents.shouldRun = true

    await app.init()
  })

  it('should send a notification when order is delivered', async () => {
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

    await request(app.getHttpServer())
      .patch(`/orders/${order.id.toString()}/deliver`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        imageId: image.id.toString(),
      })

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
