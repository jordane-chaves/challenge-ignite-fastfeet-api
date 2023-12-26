import { ReturnOrderUseCase } from '@/domain/order/application/use-cases/return-order'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/orders/:id/return')
@Roles(UserRoles.Admin)
export class ReturnOrderController {
  constructor(private returnOrder: ReturnOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') orderId: string) {
    const result = await this.returnOrder.execute({
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
