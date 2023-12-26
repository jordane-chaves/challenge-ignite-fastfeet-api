import { InvalidImageTypeError } from '@/domain/order/application/use-cases/errors/invalid-image-type-error'
import { UploadAndCreateImageUseCase } from '@/domain/order/application/use-cases/upload-and-create-image'
import { Roles } from '@/infra/auth/authorization/roles'
import { UserRoles } from '@/infra/auth/authorization/user-roles'
import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/images')
@Roles(UserRoles.Deliveryman)
export class UploadImageController {
  constructor(private uploadAndCreateImage: UploadAndCreateImageUseCase) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 2, // 2mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg)',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateImage.execute({
      fileName: file.originalname,
      fileType: file.mimetype,
      body: file.buffer,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case InvalidImageTypeError:
          throw new BadRequestException(error.message)
        default:
          throw new BadRequestException()
      }
    }

    const { image } = result.value

    return {
      imageId: image.id.toString(),
    }
  }
}
