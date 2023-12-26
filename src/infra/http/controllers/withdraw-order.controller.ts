import { OrderNotPostedError } from '@/domain/order/application/use-cases/errors/order-not-posted-error'
import { WithdrawOrderUseCase } from '@/domain/order/application/use-cases/withdraw-order'
import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/orders/:id/withdraw')
@Roles(UserRoles.Deliveryman)
export class WithdrawOrderController {
  constructor(private withdrawOrder: WithdrawOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') orderId: string) {
    const deliverymanId = user.sub

    const result = await this.withdrawOrder.execute({
      deliverymanId,
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case OrderNotPostedError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
