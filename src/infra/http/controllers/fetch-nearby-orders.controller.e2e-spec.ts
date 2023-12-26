import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'
import { RecipientAddressFactory } from 'test/factories/make-recipient-address'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Fetch Nearby Orders (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let deliverymanFactory: DeliverymanFactory
  let recipientFactory: RecipientFactory
  let recipientAddressFactory: RecipientAddressFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        DeliverymanFactory,
        RecipientFactory,
        RecipientAddressFactory,
        OrderFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    recipientAddressFactory = moduleRef.get(RecipientAddressFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[GET] /orders/nearby', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()
    const recipient1 = await recipientFactory.makePrismaRecipient()
    const recipient2 = await recipientFactory.makePrismaRecipient()

    await recipientAddressFactory.makePrismaRecipientAddress({
      recipientId: recipient1.id,
      latitude: -19.9023176,
      longitude: -44.1288589,
    })

    await recipientAddressFactory.makePrismaRecipientAddress({
      recipientId: recipient2.id,
      latitude: -19.8475733,
      longitude: -43.9172937,
    })

    await Promise.all([
      orderFactory.makePrismaOrder({
        customerId: recipient1.id,
        description: 'Package 01',
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient2.id,
        description: 'Package 02',
      }),
    ])

    const accessToken = await jwt.signAsync({
      sub: deliveryman.id.toString(),
      role: 'deliveryman',
    })

    const response = await request(app.getHttpServer())
      .get('/orders/nearby')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        latitude: -19.9023176,
        longitude: -44.1288589,
      })

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: [expect.objectContaining({ description: 'Package 01' })],
    })
  })
})
