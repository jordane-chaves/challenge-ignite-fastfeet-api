import { z } from 'zod'

import { AuthenticateRecipientUseCase } from '@/domain/account/application/use-cases/authenticate-recipient'
import { WrongCredentialsError } from '@/domain/account/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/authentication/public'
import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
} from '@nestjs/common'

import { ZodValidationPipe } from '../pipes/zod-validation-pipe'

const authenticateRecipientBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  authenticateRecipientBodySchema,
)

type AuthenticateRecipientBodySchema = z.infer<
  typeof authenticateRecipientBodySchema
>

@Controller('/sessions/recipient')
@Public()
export class AuthenticateRecipientController {
  constructor(private authenticateRecipient: AuthenticateRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: AuthenticateRecipientBodySchema,
  ) {
    const { cpf, password } = body

    const result = await this.authenticateRecipient.execute({
      cpf,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
