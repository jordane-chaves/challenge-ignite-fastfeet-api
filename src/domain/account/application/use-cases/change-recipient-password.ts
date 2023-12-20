import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { HashGenerator } from '../cryptography/hash-generator'
import { RecipientsRepository } from '../repositories/recipients-repository'
import { SamePasswordError } from './errors/same-password-error'

interface ChangeRecipientPasswordUseCaseRequest {
  recipientId: string
  newPassword: string
}

type ChangeRecipientPasswordUseCaseResponse = Either<
  ResourceNotFoundError | SamePasswordError,
  null
>

export class ChangeRecipientPasswordUseCase {
  constructor(
    private recipientsRepository: RecipientsRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: ChangeRecipientPasswordUseCaseRequest,
  ): Promise<ChangeRecipientPasswordUseCaseResponse> {
    const { recipientId, newPassword } = request

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    const isSamePassword = recipient.password === newPassword

    if (isSamePassword) {
      return left(new SamePasswordError())
    }

    const hashedNewPassword = await this.hashGenerator.hash(newPassword)

    recipient.password = hashedNewPassword

    await this.recipientsRepository.save(recipient)

    return right(null)
  }
}
