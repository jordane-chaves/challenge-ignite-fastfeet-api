import { DeleteDeliverymanUseCase } from '@/domain/account/application/use-cases/delete-deliveryman'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Delete,
} from '@nestjs/common'

@Controller('/accounts/deliveryman/:id')
@Roles(UserRoles.Admin)
export class DeleteDeliverymanController {
  constructor(private deleteDeliveryman: DeleteDeliverymanUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') deliverymanId: string) {
    const result = await this.deleteDeliveryman.execute({
      deliverymanId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
