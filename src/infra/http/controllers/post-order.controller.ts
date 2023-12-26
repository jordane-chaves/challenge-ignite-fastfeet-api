import { PostOrderUseCase } from '@/domain/order/application/use-cases/post-order'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

@Controller('/orders/:id/post')
@Roles(UserRoles.Admin)
export class PostOrderController {
  constructor(private postOrder: PostOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(@Param('id') orderId: string) {
    const result = await this.postOrder.execute({
      orderId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
