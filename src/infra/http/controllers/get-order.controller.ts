import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { GetOrderUseCase } from '@/domain/order/application/use-cases/get-order'
import { BadRequestException, Controller, Get, Param } from '@nestjs/common'

import { OrderDetailsPresenter } from '../presenters/order-details-presenter'

@Controller('/orders/:id')
export class GetOrderController {
  constructor(private getOrder: GetOrderUseCase) {}

  @Get()
  async handle(@Param('id') orderId: string) {
    const result = await this.getOrder.execute({
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { order } = result.value

    return {
      order: OrderDetailsPresenter.toHTTP(order),
    }
  }
}
