import { GetDeliverymanUseCase } from '@/domain/account/application/use-cases/get-deliveryman'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Get,
  Param,
} from '@nestjs/common'

import { DeliverymanPresenter } from '../presenters/deliveryman-presenter'

@Controller('/accounts/deliveryman/:id')
@Roles(UserRoles.Admin)
export class GetDeliverymanController {
  constructor(private getDeliveryman: GetDeliverymanUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') deliverymanId: string) {
    const result = await this.getDeliveryman.execute({
      deliverymanId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { deliveryman } = result.value

    return {
      deliveryman: DeliverymanPresenter.toHTTP(deliveryman),
    }
  }
}
