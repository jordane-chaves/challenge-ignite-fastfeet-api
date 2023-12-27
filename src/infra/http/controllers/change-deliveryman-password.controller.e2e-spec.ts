import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

import { HashComparer } from '@/domain/account/application/cryptography/hash-comparer'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Change Deliveryman Password (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let deliverymanFactory: DeliverymanFactory
  let hashComparer: HashComparer

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)
    hashComparer = moduleRef.get(HashComparer)

    await app.init()
  })

  test('[PATCH] /accounts/deliveryman/:id', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman({
      password: '123456',
    })

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const deliverymanId = deliveryman.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/accounts/deliveryman/${deliverymanId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        password: '654321',
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        id: deliveryman.id.toString(),
      },
    })

    if (!userOnDatabase) {
      throw new Error('Invalid deliveryman.')
    }

    const isPasswordValid = await hashComparer.compare(
      '654321',
      userOnDatabase.password,
    )

    expect(isPasswordValid).toBe(true)
  })
})
