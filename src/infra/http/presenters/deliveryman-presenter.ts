import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'

export class DeliverymanPresenter {
  static toHTTP(deliveryman: Deliveryman) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      cpf: deliveryman.cpf.value,
    }
  }
}
