import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { Env } from '.'

@Injectable()
export class EnvService {
  constructor(private config: ConfigService<Env, true>) {}

  get<T extends keyof Env>(key: T) {
    return this.config.get(key, { infer: true })
  }
}
