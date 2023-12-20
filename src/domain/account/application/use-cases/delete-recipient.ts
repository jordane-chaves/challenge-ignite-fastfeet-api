import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

import { RecipientsRepository } from '../repositories/recipients-repository'

interface DeleteRecipientUseCaseRequest {
  recipientId: string
}

type DeleteRecipientUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteRecipientUseCase {
  constructor(private recipientsRepository: RecipientsRepository) {}

  async execute(
    request: DeleteRecipientUseCaseRequest,
  ): Promise<DeleteRecipientUseCaseResponse> {
    const { recipientId } = request

    const recipient = await this.recipientsRepository.findById(recipientId)

    if (!recipient) {
      return left(new ResourceNotFoundError())
    }

    await this.recipientsRepository.delete(recipient)

    return right(null)
  }
}
