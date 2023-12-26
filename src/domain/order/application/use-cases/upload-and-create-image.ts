import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'

import { Image } from '../../enterprise/entities/image'
import { ImagesRepository } from '../repositories/images-repository'
import { Uploader } from '../storage/uploader'
import { InvalidImageTypeError } from './errors/invalid-image-type-error'

interface UploadAndCreateImageUseCaseRequest {
  fileName: string
  fileType: string
  body: Buffer
}

type UploadAndCreateImageUseCaseResponse = Either<
  InvalidImageTypeError,
  {
    image: Image
  }
>

@Injectable()
export class UploadAndCreateImageUseCase {
  constructor(
    private imagesRepository: ImagesRepository,
    private uploader: Uploader,
  ) {}

  async execute(
    request: UploadAndCreateImageUseCaseRequest,
  ): Promise<UploadAndCreateImageUseCaseResponse> {
    const { fileName, fileType, body } = request

    const isValidFileType = /^image\/(?:jpeg|png)$/i.test(fileType)

    if (!isValidFileType) {
      return left(new InvalidImageTypeError())
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const image = Image.create({
      title: fileName,
      url,
    })

    await this.imagesRepository.create(image)

    return right({
      image,
    })
  }
}
