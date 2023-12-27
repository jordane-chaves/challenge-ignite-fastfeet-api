import { z } from 'zod'

import { CreateRecipientUseCase } from '@/domain/account/application/use-cases/create-recipient'
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
import { RecipientPresenter } from '../presenters/recipient-presenter'

const createRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
  street: z.string(),
  number: z.number(),
  neighborhood: z.string(),
  city: z.string(),
  cep: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createRecipientBodySchema)

type CreateRecipientBodySchema = z.infer<typeof createRecipientBodySchema>

@Controller('/accounts/recipient')
@Roles(UserRoles.Admin)
export class CreateRecipientController {
  constructor(private createRecipient: CreateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(@Body(bodyValidationPipe) body: CreateRecipientBodySchema) {
    const { name, cpf, password, street, number, neighborhood, city, cep } =
      body

    const result = await this.createRecipient.execute({
      name,
      cpf,
      password,
      street,
      number,
      neighborhood,
      city,
      cep,
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
