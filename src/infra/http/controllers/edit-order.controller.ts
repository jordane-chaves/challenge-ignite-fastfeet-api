import { z } from 'zod'

import { EditOrderUseCase } from '@/domain/order/application/use-cases/edit-order'
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

const editOrderBodySchema = z.object({
  customerId: z.string().uuid(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editOrderBodySchema)

type EditOrderBodySchema = z.infer<typeof editOrderBodySchema>

@Controller('/orders/:id')
@Roles(UserRoles.Admin)
export class EditOrderController {
  constructor(private editOrder: EditOrderUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditOrderBodySchema,
    @Param('id') orderId: string,
  ) {
    const { customerId, description } = body

    const result = await this.editOrder.execute({
      customerId,
      orderId,
      description,
    })

    if (result.isLeft()) {
      const error = result.value

      throw new BadRequestException(error.message)
    }
  }
}
