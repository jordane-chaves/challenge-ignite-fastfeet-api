import { Recipient } from '@/domain/account/enterprise/entities/recipient'

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      cpf: recipient.cpf.value,
    }
  }
}
