import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Fetch Deliveryman Orders (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
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
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[GET] /orders/deliveryman', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        deliverymanId: deliveryman.id,
        description: 'Package 01',
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        deliverymanId: deliveryman.id,
        description: 'Package 02',
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        deliverymanId: deliveryman.id,
        description: 'Package 03',
      }),
    ])

    const accessToken = await jwt.signAsync({
      sub: deliveryman.id.toString(),
      role: 'deliveryman',
    })

    const response = await request(app.getHttpServer())
      .get('/orders/deliveryman')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({
          deliverymanId: deliveryman.id.toString(),
          description: 'Package 01',
        }),
        expect.objectContaining({
          deliverymanId: deliveryman.id.toString(),
          description: 'Package 02',
        }),
        expect.objectContaining({
          deliverymanId: deliveryman.id.toString(),
          description: 'Package 03',
        }),
      ]),
    })
  })
})
