import { z } from 'zod'

import { ChangeRecipientPasswordUseCase } from '@/domain/account/application/use-cases/change-recipient-password'
import { SamePasswordError } from '@/domain/account/application/use-cases/errors/same-password-error'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const changeRecipientPasswordBodySchema = z.object({
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  changeRecipientPasswordBodySchema,
)

type ChangeRecipientPasswordBodySchema = z.infer<
  typeof changeRecipientPasswordBodySchema
>

@Controller('/accounts/recipient/:id')
@Roles(UserRoles.Admin)
export class ChangeRecipientPasswordController {
  constructor(
    private changeRecipientPassword: ChangeRecipientPasswordUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangeRecipientPasswordBodySchema,
    @Param('id') recipientId: string,
  ) {
    const { password } = body

    const result = await this.changeRecipientPassword.execute({
      recipientId,
      newPassword: password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case SamePasswordError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
