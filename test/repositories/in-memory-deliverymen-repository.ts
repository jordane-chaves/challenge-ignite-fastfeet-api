import { DeliverymenRepository } from '@/domain/account/application/repositories/deliverymen-repository'
import { Deliveryman } from '@/domain/account/enterprise/entities/deliveryman'

export class InMemoryDeliverymenRepository implements DeliverymenRepository {
  public items: Deliveryman[] = []

  async findByCpf(cpf: string): Promise<Deliveryman | null> {
    const deliveryman = this.items.find((item) => item.cpf.value === cpf)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async findById(id: string): Promise<Deliveryman | null> {
    const deliveryman = this.items.find((item) => item.id.toString() === id)

    if (!deliveryman) {
      return null
    }

    return deliveryman
  }

  async create(deliveryman: Deliveryman): Promise<void> {
    this.items.push(deliveryman)
  }

  async save(deliveryman: Deliveryman): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === deliveryman.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items[itemIndex] = deliveryman
    }
  }

  async delete(deliveryman: Deliveryman): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toString() === deliveryman.id.toString(),
    )

    if (itemIndex >= 0) {
      this.items.splice(itemIndex, 1)
    }
  }
}
