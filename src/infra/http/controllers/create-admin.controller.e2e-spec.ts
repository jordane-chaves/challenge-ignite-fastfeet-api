import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Create Admin (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let adminFactory: AdminFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)

    await app.init()
  })

  test('[POST] /accounts/admin', async () => {
    const admin = await adminFactory.makePrismaAdmin()

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const response = await request(app.getHttpServer())
      .post('/accounts/admin')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: '123.123.123-00',
        password: '123456',
      })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '123.123.123-00',
      },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
