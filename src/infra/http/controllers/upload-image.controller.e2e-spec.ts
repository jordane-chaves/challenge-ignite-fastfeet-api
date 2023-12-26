import request from 'supertest'
import { DeliverymanFactory } from 'test/factories/make-deliveryman'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Upload Image (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let deliverymanFactory: DeliverymanFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [DeliverymanFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    deliverymanFactory = moduleRef.get(DeliverymanFactory)

    await app.init()
  })

  test('[POST] /images', async () => {
    const deliveryman = await deliverymanFactory.makePrismaDeliveryman()

    const accessToken = await jwt.signAsync({
      sub: deliveryman.id.toString(),
      role: 'deliveryman',
    })

    const response = await request(app.getHttpServer())
      .post('/images')
      .set('Authorization', `Bearer ${accessToken}`)
      .attach('file', './test/e2e/sample-upload.png')

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual({
      imageId: expect.any(String),
    })
  })
})
