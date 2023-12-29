import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'

interface FetchNotificationsUseCaseRequest {
  recipientId: string
  page: number
  perPage: number
}

type FetchNotificationsUseCaseResponse = Either<
  null,
  {
    notifications: Notification[]
  }
>

@Injectable()
export class FetchNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute(
    request: FetchNotificationsUseCaseRequest,
  ): Promise<FetchNotificationsUseCaseResponse> {
    const { recipientId, page, perPage } = request

    const notifications =
      await this.notificationsRepository.findManyByRecipientId(recipientId, {
        page,
        perPage,
      })

    return right({
      notifications,
    })
  }
}
