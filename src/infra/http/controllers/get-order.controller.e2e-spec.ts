import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { ImageFactory } from 'test/factories/make-image'
import { OrderFactory } from 'test/factories/make-order'
import { OrderImageFactory } from 'test/factories/make-order-image'
import { RecipientFactory } from 'test/factories/make-recipient'
import { RecipientAddressFactory } from 'test/factories/make-recipient-address'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Get Order (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let recipientAddressFactory: RecipientAddressFactory
  let orderFactory: OrderFactory
  let imageFactory: ImageFactory
  let orderImageFactory: OrderImageFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliverymanFactory,
        RecipientFactory,
        RecipientAddressFactory,
        OrderFactory,
        ImageFactory,
        OrderImageFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    recipientAddressFactory = moduleRef.get(RecipientAddressFactory)
    orderFactory = moduleRef.get(OrderFactory)
    imageFactory = moduleRef.get(ImageFactory)
    orderImageFactory = moduleRef.get(OrderImageFactory)

    await app.init()
  })

  test('[GET] /orders/:id', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'John Doe',
    })

    await recipientAddressFactory.makePrismaRecipientAddress({
      recipientId: recipient.id,
      street: 'Center street',
    })

    const order = await orderFactory.makePrismaOrder({
      customerId: recipient.id,
      description: 'Package 01',
    })

    const image = await imageFactory.makePrismaImage({
      url: 'some-image.png',
    })

    await orderImageFactory.makePrismaOrderImage({
      imageId: image.id,
      orderId: order.id,
    })

    const accessToken = await jwt.signAsync({
      sub: deliveryman.id.toString(),
      role: 'deliveryman',
    })

    const response = await request(app.getHttpServer())
      .get(`/orders/${order.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId: recipient.id.toString(),
        description: 'New package',
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      order: expect.objectContaining({
        description: 'Package 01',
        customer: 'John Doe',
        street: 'Center street',
        image: 'some-image.png',
      }),
    })
  })
})
