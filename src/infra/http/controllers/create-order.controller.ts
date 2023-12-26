import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { CreateOrderUseCase } from '@/domain/order/application/use-cases/create-order'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import { BadRequestException, Body, Controller, Post } from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const createOrderBodySchema = z.object({
  customerId: z.string().uuid(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createOrderBodySchema)

type CreateOrderBodySchema = z.infer<typeof createOrderBodySchema>

@Controller('/orders')
@Roles(UserRoles.Admin)
export class CreateOrderController {
  constructor(private createOrder: CreateOrderUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateOrderBodySchema) {
    const { customerId, description } = body

    const result = await this.createOrder.execute({
      customerId,
      description,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new BadRequestException('Customer not found.')
        default:
          throw new BadRequestException()
      }
    }

    const { order } = result.value

    return {
      order: OrderPresenter.toHTTP(order),
    }
  }
}
