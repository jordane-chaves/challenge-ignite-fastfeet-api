import { CustomerAddressesRepository } from '@/domain/order/application/repositories/customer-addresses-repository'
import { CustomerAddress } from '@/domain/order/enterprise/entities/value-objects/customer-address'

export class InMemoryCustomerAddressesRepository
  implements CustomerAddressesRepository
{
  public items: CustomerAddress[] = []

  async findByCustomerId(customerId: string): Promise<CustomerAddress | null> {
    const customerAddress = this.items.find(
      (item) => item.customerId.toString() === customerId,
    )

    if (!customerAddress) {
      return null
    }

    return customerAddress
  }
}
