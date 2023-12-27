import { z } from 'zod'

import { CreateDeliverymanUseCase } from '@/domain/account/application/use-cases/create-deliveryman'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const createDeliverymanBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createDeliverymanBodySchema)

type CreateDeliverymanBodySchema = z.infer<typeof createDeliverymanBodySchema>

@Controller('/accounts/deliveryman')
@Roles(UserRoles.Admin)
export class CreateDeliverymanController {
  constructor(private createDeliveryman: CreateDeliverymanUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateDeliverymanBodySchema) {
    const { name, cpf, password } = body

    const result = await this.createDeliveryman.execute({
      name,
      cpf,
      password,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { deliveryman } = result.value

    return {
      deliveryman,
    }
  }
}
