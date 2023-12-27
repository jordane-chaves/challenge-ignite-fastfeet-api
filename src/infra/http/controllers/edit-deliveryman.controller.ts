import { z } from 'zod'

import { EditDeliverymanUseCase } from '@/domain/account/application/use-cases/edit-deliveryman'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const editDeliverymanBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editDeliverymanBodySchema)

type EditDeliverymanBodySchema = z.infer<typeof editDeliverymanBodySchema>

@Controller('/accounts/deliveryman/:id')
@Roles(UserRoles.Admin)
export class EditDeliverymanController {
  constructor(private editDeliveryman: EditDeliverymanUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditDeliverymanBodySchema,
    @Param('id') deliverymanId: string,
  ) {
    const { name, cpf } = body

    const result = await this.editDeliveryman.execute({
      deliverymanId,
      name,
      cpf,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
