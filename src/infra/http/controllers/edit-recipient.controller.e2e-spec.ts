import request from 'supertest'
import { AdminFactory } from 'test/factories/make-admin'
import { RecipientFactory } from 'test/factories/make-recipient'
import { RecipientAddressFactory } from 'test/factories/make-recipient-address'

import { CPF } from '@/domain/account/enterprise/entities/value-objects/cpf'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Edit Recipient (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let prisma: PrismaService
  let adminFactory: AdminFactory
  let recipientFactory: RecipientFactory
  let recipientAddressFactory: RecipientAddressFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AdminFactory, RecipientFactory, RecipientAddressFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    prisma = moduleRef.get(PrismaService)
    adminFactory = moduleRef.get(AdminFactory)
    recipientFactory = moduleRef.get(RecipientFactory)
    recipientAddressFactory = moduleRef.get(RecipientAddressFactory)

    await app.init()
  })

  test('[PUT] /accounts/recipient', async () => {
    const admin = await adminFactory.makePrismaAdmin()
    const recipient = await recipientFactory.makePrismaRecipient({
      name: 'John Doe',
      cpf: CPF.create('321.321.321-01'),
    })

    await recipientAddressFactory.makePrismaRecipientAddress({
      recipientId: recipient.id,
      latitude: -20.4422435,
      longitude: -44.7805533,
    })

    const accessToken = await jwt.signAsync({
      sub: admin.id.toString(),
      role: 'admin',
    })

    const recipientId = recipient.id.toString()

    const response = await request(app.getHttpServer())
      .put(`/accounts/recipient/${recipientId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        name: 'John Doe',
        cpf: '321.321.456-00',
        street: 'Rua do meio',
        number: 10,
        neighborhood: 'Centro',
        city: 'Cláudio',
        cep: '35530000',
        latitude: -20.4446516,
        longitude: -44.7663455,
      })

    expect(response.statusCode).toBe(204)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        cpf: '321.321.456-00',
        role: 'RECIPIENT',
      },
    })

    expect(userOnDatabase).toBeTruthy()

    const addressesOnDatabase = await prisma.address.findMany({
      where: {
        recipientId,
      },
    })

    expect(addressesOnDatabase).toHaveLength(1)
    expect(addressesOnDatabase[0].latitude.toNumber()).toEqual(-20.4446516)
    expect(addressesOnDatabase[0].longitude.toNumber()).toEqual(-44.7663455)
  })
})
