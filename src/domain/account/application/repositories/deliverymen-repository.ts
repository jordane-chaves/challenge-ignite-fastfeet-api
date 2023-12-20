import { Deliveryman } from '../../enterprise/entities/deliveryman'

export interface DeliverymenRepository {
  findByCpf(cpf: string): Promise<Deliveryman | null>
  findById(id: string): Promise<Deliveryman | null>
  create(deliveryman: Deliveryman): Promise<void>
  save(deliveryman: Deliveryman): Promise<void>
  delete(deliveryman: Deliveryman): Promise<void>
}
