import { CustomerAddress } from '../../enterprise/entities/value-objects/customer-address'

export interface CustomerAddressesRepository {
  findByCustomerId(customerId: string): Promise<CustomerAddress | null>
}
