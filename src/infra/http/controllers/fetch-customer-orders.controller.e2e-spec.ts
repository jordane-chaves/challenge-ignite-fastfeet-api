import request from 'supertest'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Fetch Customer Orders (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[GET] /orders/customer', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 01',
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 02',
      }),
      orderFactory.makePrismaOrder({
        customerId: recipient.id,
        description: 'Package 03',
      }),
    ])

    const accessToken = await jwt.signAsync({
      sub: recipient.id.toString(),
      role: 'recipient',
    })

    const response = await request(app.getHttpServer())
      .get('/orders/customer')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      orders: expect.arrayContaining([
        expect.objectContaining({ description: 'Package 01' }),
        expect.objectContaining({ description: 'Package 02' }),
        expect.objectContaining({ description: 'Package 03' }),
      ]),
    })
  })
})
