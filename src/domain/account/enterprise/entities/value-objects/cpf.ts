export class CPF {
  private cpf: string

  get value() {
    return this.cpf
  }

  private validateCpfFormat(cpf: string) {
    return /^\d{3}(?:\.\d{3}){2}-\d{2}$/.test(cpf)
  }

  private constructor(cpf: string) {
    const isValidCpfFormat = this.validateCpfFormat(cpf)

    if (!isValidCpfFormat) {
      throw new Error('Invalid CPF format.')
    }

    this.cpf = cpf
  }

  static create(cpf: string) {
    return new CPF(cpf)
  }
}
