import { PaginationParams } from '@/core/repositories/pagination-params'

import { Notification } from '../../enterprise/entities/notification'

export abstract class NotificationsRepository {
  abstract findManyByRecipientId(
    recipientId: string,
    params: PaginationParams,
  ): Promise<Notification[]>

  abstract findById(id: string): Promise<Notification | null>
  abstract create(notification: Notification): Promise<void>
  abstract save(notification: Notification): Promise<void>
}
