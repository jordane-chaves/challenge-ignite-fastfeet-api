import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderPostedEvent } from '@/domain/order/enterprise/events/order-posted'

import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderPosted implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderPostedNotification.bind(this),
      OrderPostedEvent.name,
    )
  }

  private async sendOrderPostedNotification({ order }: OrderPostedEvent) {
    await this.sendNotification.execute({
      recipientId: order.customerId.toString(),
      title: `Novo status em "${order.description}"`,
      content: `A encomenda "${order.description}" foi postada.`,
    })
  }
}
