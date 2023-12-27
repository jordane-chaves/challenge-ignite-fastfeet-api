import { z } from 'zod'

import { EditRecipientUseCase } from '@/domain/account/application/use-cases/edit-recipient'
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

const editRecipientBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  street: z.string(),
  number: z.number(),
  neighborhood: z.string(),
  city: z.string(),
  cep: z.string(),
  latitude: z.number(),
  longitude: z.number(),
})

const bodyValidationPipe = new ZodValidationPipe(editRecipientBodySchema)

type EditRecipientBodySchema = z.infer<typeof editRecipientBodySchema>

@Controller('/accounts/recipient/:id')
@Roles(UserRoles.Admin)
export class EditRecipientController {
  constructor(private editRecipient: EditRecipientUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditRecipientBodySchema,
    @Param('id') recipientId: string,
  ) {
    const {
      name,
      cpf,
      street,
      number,
      neighborhood,
      city,
      cep,
      latitude,
      longitude,
    } = body

    const result = await this.editRecipient.execute({
      recipientId,
      name,
      cpf,
      street,
      number,
      neighborhood,
      city,
      cep,
      latitude,
      longitude,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
