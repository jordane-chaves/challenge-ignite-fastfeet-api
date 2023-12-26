import { randomUUID } from 'node:crypto'

import {
  Uploader,
  UploaderParams,
} from '@/domain/order/application/storage/uploader'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { Injectable } from '@nestjs/common'

import { EnvService } from '../env/env.service'

@Injectable()
export class R2Storage implements Uploader {
  private client: S3Client

  constructor(private env: EnvService) {
    const accountId = env.get('CLOUDFLARE_ACCOUNT_ID')

    this.client = new S3Client({
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
      credentials: {
        accessKeyId: env.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: env.get('AWS_SECRET_ACCESS_KEY'),
      },
    })
  }

  async upload({
    fileName,
    fileType,
    body,
  }: UploaderParams): Promise<{ url: string }> {
    const uploadId = randomUUID()
    const uniqueFileName = `${uploadId}-${fileName}`

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.env.get('AWS_BUCKET_NAME'),
        Key: uniqueFileName,
        ContentType: fileType,
        Body: body,
      }),
    )

    return {
      url: uniqueFileName,
    }
  }
}
