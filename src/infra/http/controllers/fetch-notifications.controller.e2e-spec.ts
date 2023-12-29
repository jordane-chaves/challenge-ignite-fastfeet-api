import request from 'supertest'
import { NotificationFactory } from 'test/factories/make-notification'
import { RecipientFactory } from 'test/factories/make-recipient'

import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'

describe('Fetch Notifications (E2E)', () => {
  let app: INestApplication
  let jwt: JwtService
  let recipientFactory: RecipientFactory
  let notificationFactory: NotificationFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [RecipientFactory, NotificationFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    jwt = moduleRef.get(JwtService)
    recipientFactory = moduleRef.get(RecipientFactory)
    notificationFactory = moduleRef.get(NotificationFactory)

    await app.init()
  })

  test('[GET] /notifications', async () => {
    const recipient = await recipientFactory.makePrismaRecipient()

    await Promise.all([
      notificationFactory.makePrismaNotification({ recipientId: recipient.id }),
      notificationFactory.makePrismaNotification({ recipientId: recipient.id }),
      notificationFactory.makePrismaNotification({ recipientId: recipient.id }),
    ])

    const accessToken = await jwt.signAsync({
      sub: recipient.id.toString(),
      role: 'recipient',
    })

    const response = await request(app.getHttpServer())
      .get('/notifications')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual({
      notifications: expect.arrayContaining([
        expect.objectContaining({ recipientId: recipient.id.toString() }),
        expect.objectContaining({ recipientId: recipient.id.toString() }),
        expect.objectContaining({ recipientId: recipient.id.toString() }),
      ]),
    })
  })
})
