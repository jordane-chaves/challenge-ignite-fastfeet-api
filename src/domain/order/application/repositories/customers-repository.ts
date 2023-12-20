import { Customer } from '../../enterprise/entities/customer'

export interface CustomersRepository {
  findById(id: string): Promise<Customer | null>
}
