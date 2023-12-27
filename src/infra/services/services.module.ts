import { Location } from '@/domain/account/application/services/location'
import { Module } from '@nestjs/common'

import { BrasilApiLocation } from './brasil-api-location'

@Module({
  providers: [
    {
      provide: Location,
      useClass: BrasilApiLocation,
    },
  ],
  exports: [Location],
})
export class ServicesModule {}
