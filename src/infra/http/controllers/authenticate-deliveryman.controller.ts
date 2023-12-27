import { z } from 'zod'

import { AuthenticateDeliverymanUseCase } from '@/domain/account/application/use-cases/authenticate-deliveryman'
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

const authenticateDeliverymanBodySchema = z.object({
  cpf: z.string(),
  password: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(
  authenticateDeliverymanBodySchema,
)

type AuthenticateDeliverymanBodySchema = z.infer<
  typeof authenticateDeliverymanBodySchema
>

@Controller('/sessions/deliveryman')
@Public()
export class AuthenticateDeliverymanController {
  constructor(
    private authenticateDeliveryman: AuthenticateDeliverymanUseCase,
  ) {}

  @Post()
  @HttpCode(201)
  async handle(
    @Body(bodyValidationPipe) body: AuthenticateDeliverymanBodySchema,
  ) {
    const { cpf, password } = body

    const result = await this.authenticateDeliveryman.execute({
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
