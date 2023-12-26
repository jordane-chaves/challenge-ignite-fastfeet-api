import { ExtractJwt, Strategy } from 'passport-jwt'
import { ZodError, z } from 'zod'

import { Env } from '@/infra/env'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'

const tokenPayloadSchema = z.object({
  sub: z.string().uuid(),
  role: z.enum(['admin', 'deliveryman', 'recipient']).optional(),
})

export type UserPayload = z.infer<typeof tokenPayloadSchema>

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService<Env, true>) {
    const publicKey = config.get('JWT_PUBLIC_KEY', { infer: true })

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    })
  }

  async validate(payload: UserPayload) {
    try {
      return tokenPayloadSchema.parse(payload)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new UnauthorizedException('Invalid token format.')
      }

      throw new UnauthorizedException()
    }
  }
}
