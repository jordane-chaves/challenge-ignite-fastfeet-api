import { z } from 'zod'

import { FetchDeliverymanOrdersUseCase } from '@/domain/order/application/use-cases/fetch-deliveryman-orders'
import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  Query,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const fetchDeliverymanOrdersQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().min(1).optional().default(20),
})

const queryValidationPipe = new ZodValidationPipe(
  fetchDeliverymanOrdersQueryParamsSchema,
)

type FetchDeliverymanOrdersQueryParamsSchema = z.infer<
  typeof fetchDeliverymanOrdersQueryParamsSchema
>

@Controller('/orders/deliveryman')
@Roles(UserRoles.Deliveryman)
export class FetchDeliverymanOrdersController {
  constructor(private fetchDeliverymanOrders: FetchDeliverymanOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe)
    queries: FetchDeliverymanOrdersQueryParamsSchema,
  ) {
    const { page, perPage } = queries
    const deliverymanId = user.sub

    const result = await this.fetchDeliverymanOrders.execute({
      deliverymanId,
      page,
      perPage,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { orders } = result.value

    return {
      orders: orders.map(OrderPresenter.toHTTP),
    }
  }
}
