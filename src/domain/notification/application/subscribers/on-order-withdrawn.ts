import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderWithdrawnEvent } from '@/domain/order/enterprise/events/order-withdrawn'

import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderWithdrawn implements EventHandler {
  constructor(private sendNotification: SendNotificationUseCase) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderWithdrawnNotification.bind(this),
      OrderWithdrawnEvent.name,
    )
  }

  private async sendOrderWithdrawnNotification({ order }: OrderWithdrawnEvent) {
    await this.sendNotification.execute({
      recipientId: order.customerId.toString(),
      title: `Novo status em "${order.description}"`,
      content: `A encomenda "${order.description}" foi retirada para entrega.`,
    })
  }
}
