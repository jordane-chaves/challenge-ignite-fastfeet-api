import { Customer } from '../../enterprise/entities/customer'

export abstract class CustomersRepository {
  abstract findById(id: string): Promise<Customer | null>
}
