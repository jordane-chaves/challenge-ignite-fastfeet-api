import { z } from 'zod'

import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { DeliverOrderUseCase } from '@/domain/order/application/use-cases/deliver-order'
import { CurrentUser } from '@/infra/auth/authentication/current-user-decorator'
import { UserPayload } from '@/infra/auth/authentication/jwt.strategy'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const deliverOrderBodySchema = z.object({
  imageId: z.string().uuid(),
})

const bodyValidationPipe = new ZodValidationPipe(deliverOrderBodySchema)

type DeliverOrderBodySchema = z.infer<typeof deliverOrderBodySchema>

@Controller('/orders/:id/deliver')
@Roles(UserRoles.Deliveryman)
export class DeliverOrderController {
  constructor(private deliverOrder: DeliverOrderUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: DeliverOrderBodySchema,
    @Param('id') orderId: string,
  ) {
    const { imageId } = body
    const deliverymanId = user.sub

    const result = await this.deliverOrder.execute({
      deliverymanId,
      imageId,
      orderId,
    })

    if (result.isLeft()) {
      const error = result.value

      console.error(error)

      switch (error.constructor) {
        case NotAllowedError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }
  }
}
