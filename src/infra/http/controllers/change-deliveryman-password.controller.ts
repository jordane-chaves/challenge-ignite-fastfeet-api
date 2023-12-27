import { z } from 'zod'

import { ChangeDeliverymanPasswordUseCase } from '@/domain/account/application/use-cases/change-deliveryman-password'
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

const changeDeliverymanPasswordBodySchema = z.object({
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  changeDeliverymanPasswordBodySchema,
)

type ChangeDeliverymanPasswordBodySchema = z.infer<
  typeof changeDeliverymanPasswordBodySchema
>

@Controller('/accounts/deliveryman/:id')
@Roles(UserRoles.Admin)
export class ChangeDeliverymanPasswordController {
  constructor(
    private changeDeliverymanPassword: ChangeDeliverymanPasswordUseCase,
  ) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: ChangeDeliverymanPasswordBodySchema,
    @Param('id') deliverymanId: string,
  ) {
    const { password } = body

    const result = await this.changeDeliverymanPassword.execute({
      deliverymanId,
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
