import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Create Order (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)

    await app.init()
  })

  test('[POST] /orders', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient()

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const response = await request(app.getHttpServer())
      .post('/orders')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        customerId: recipient.id.toString(),
        description: 'Package 01',
      })

    expect(response.statusCode).toBe(201)

    const orderOnDatabase = await prisma.order.findFirst({
      where: {
        description: 'Package 01',
      },
    })

    expect(orderOnDatabase).toBeTruthy()
  })
})
