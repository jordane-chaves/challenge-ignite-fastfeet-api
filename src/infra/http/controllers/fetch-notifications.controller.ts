import { z } from 'zod'

import { FetchNotificationsUseCase } from '@/domain/notification/application/use-cases/fetch-notifications'
import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { NotificationPresenter } from '../presenters/notification-presenter'

const fetchNotificationsQuerySchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().min(1).optional().default(20),
})

const queryValidationPipe = new ZodValidationPipe(fetchNotificationsQuerySchema)

type FetchNotificationsQuerySchema = z.infer<
  typeof fetchNotificationsQuerySchema
>

@Controller('/notifications')
export class FetchNotificationsController {
  constructor(private fetchNotifications: FetchNotificationsUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) queries: FetchNotificationsQuerySchema,
  ) {
    const { page, perPage } = queries
    const recipientId = user.sub

    const result = await this.fetchNotifications.execute({
      recipientId,
      page,
      perPage,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { notifications } = result.value

    return {
      notifications: notifications.map(NotificationPresenter.toHTTP),
    }
  }
}
