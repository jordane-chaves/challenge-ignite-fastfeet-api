import { z } from 'zod'

import { FetchNearbyOrdersUseCase } from '@/domain/order/application/use-cases/fetch-nearby-orders'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { OrderPresenter } from '../presenters/order-presenter'

const fetchNearbyOrdersBodySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(fetchNearbyOrdersBodySchema)

type FetchNearbyOrdersBodySchema = z.infer<typeof fetchNearbyOrdersBodySchema>

@Controller('/orders/nearby')
@Roles(UserRoles.Deliveryman)
export class FetchNearbyOrdersController {
  constructor(private fetchNearbyOrders: FetchNearbyOrdersUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Body(bodyValidationPipe) body: FetchNearbyOrdersBodySchema) {
    const { latitude, longitude } = body

    const result = await this.fetchNearbyOrders.execute({
      deliverymanLatitude: latitude,
      deliverymanLongitude: longitude,
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
