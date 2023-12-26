import { z } from 'zod'

import { FetchCustomerOrdersUseCase } from '@/domain/order/application/use-cases/fetch-customer-orders'
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

const fetchCustomerOrdersQueryParamsSchema = z.object({
  page: z.coerce.number().min(1).optional().default(1),
  perPage: z.coerce.number().min(1).optional().default(20),
})

const queryValidationPipe = new ZodValidationPipe(
  fetchCustomerOrdersQueryParamsSchema,
)

type FetchCustomerOrdersQueryParamsSchema = z.infer<
  typeof fetchCustomerOrdersQueryParamsSchema
>

@Controller('/orders/customer')
@Roles(UserRoles.Recipient)
export class FetchCustomerOrdersController {
  constructor(private fetchCustomerOrders: FetchCustomerOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(
    @CurrentUser() user: UserPayload,
    @Query(queryValidationPipe) queries: FetchCustomerOrdersQueryParamsSchema,
  ) {
    const { page, perPage } = queries
    const customerId = user.sub

    const result = await this.fetchCustomerOrders.execute({
      customerId,
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
