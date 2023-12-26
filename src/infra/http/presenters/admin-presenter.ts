import { Admin } from '@/domain/account/enterprise/entities/admin'

export class AdminPresenter {
  static toHTTP(admin: Admin) {
    return {
      id: admin.id.toString(),
      name: admin.name.toString(),
      cpf: admin.cpf.value,
    }
  }
}
