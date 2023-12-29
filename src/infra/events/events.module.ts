import { OnOrderDelivered } from '@/domain/notification/application/subscribers/on-order-delivered'
import { OnOrderPosted } from '@/domain/notification/application/subscribers/on-order-posted'
import { OnOrderReturned } from '@/domain/notification/application/subscribers/on-order-returned'
import { OnOrderWithdrawn } from '@/domain/notification/application/subscribers/on-order-withdrawn'
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  providers: [
    OnOrderDelivered,
    OnOrderPosted,
    OnOrderReturned,
    OnOrderWithdrawn,
    SendNotificationUseCase,
  ],
})
export class EventsModule {}
