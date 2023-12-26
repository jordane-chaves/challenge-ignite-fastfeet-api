import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { AuthModule } from './auth/auth.module'
import { envSchema } from './env'
import { EnvModule } from './env/env.module'
import { HttpModule } from './http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      expandVariables: true,
      isGlobal: true,
    }),
    AuthModule,
    EnvModule,
    HttpModule,
  ],
})
export class AppModule {}
