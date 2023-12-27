import { GetRecipientUseCase } from '@/domain/account/application/use-cases/get-recipient'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  Controller,
  HttpCode,
  Get,
  Param,
  BadRequestException,
} from '@nestjs/common'

import { RecipientPresenter } from '../presenters/recipient-presenter'

@Controller('/accounts/recipient/:id')
@Roles(UserRoles.Admin)
export class GetRecipientController {
  constructor(private getRecipient: GetRecipientUseCase) {}

  @Get()
  @HttpCode(200)
  async handle(@Param('id') recipientId: string) {
    const result = await this.getRecipient.execute({
      recipientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { recipient } = result.value

    return {
      recipient: RecipientPresenter.toHTTP(recipient),
    }
  }
}
