import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { OrderFactory } from 'test/factories/make-order'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Edit Order (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let orderFactory: OrderFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, OrderFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    orderFactory = moduleRef.get(OrderFactory)

    await app.init()
  })

  test('[PUT] /orders/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()
    const order = await orderFactory.makePrismaOrder({
      customerId: recipient.id,
      description: 'Package 01',
    })

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const response = await request(app.getHttpServer())
      .put(`/orders/${order.id.toString()}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId: recipient.id.toString(),
        description: 'New package',
      })

    expect(response.statusCode).toBe(204)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        description: 'New package',
      },
    })

    expect(orderOnDatabase).toEqual(
      expect.objectContaining({
        description: 'New package',
      }),
    )
  })
})
