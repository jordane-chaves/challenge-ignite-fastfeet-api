import { DeleteRecipientUseCase } from '@/domain/account/application/use-cases/delete-recipient'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Controller,
  HttpCode,
  Param,
  Delete,
} from '@nestjs/common'

@Controller('/accounts/recipient/:id')
@Roles(UserRoles.Admin)
export class DeleteRecipientController {
  constructor(private deleteRecipient: DeleteRecipientUseCase) {}

  @Delete()
  @HttpCode(204)
  async handle(@Param('id') recipientId: string) {
    const result = await this.deleteRecipient.execute({
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
