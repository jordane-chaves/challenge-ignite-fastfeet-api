import { DeleteOrderUseCase } from '@/domain/order/application/use-cases/delete-order'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'

@Controller('/orders/:id')
@Roles(UserRoles.Admin)
export class DeleteOrderController {
  constructor(private deleteOrder: DeleteOrderUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') orderId: string) {
    const result = await this.deleteOrder.execute({
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
