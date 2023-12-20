import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { Recipient } from '../../enterprise/entities/recipient'
import { RecipientsRepository } from '../repositories/recipients-repository'

interface GetRecipientUseCaseRequest {
  recipientId: string
}

type GetRecipientUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    recipient: Recipient
  }
>

export class GetRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute(
    request: GetRecipientUseCaseRequest,
  ): Promise<GetRecipientUseCaseResponse> {
    const { recipientId } = request

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    return right({
      recipient,
    })
  }
}
