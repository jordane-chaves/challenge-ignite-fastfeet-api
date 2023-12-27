import { Deliveryman } from '../../enterprise/entities/deliveryman'

export abstract class DeliverymenRepository {
  abstract findByCpf(cpf: string): Promise<Deliveryman | null>
  abstract findById(id: string): Promise<Deliveryman | null>
  abstract create(deliveryman: Deliveryman): Promise<void>
  abstract save(deliveryman: Deliveryman): Promise<void>
  abstract delete(deliveryman: Deliveryman): Promise<void>
}
