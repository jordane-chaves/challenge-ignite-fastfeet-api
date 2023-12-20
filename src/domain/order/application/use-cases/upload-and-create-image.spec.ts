import { InMemoryImagesRepository } from 'test/repositories/in-memory-images-repository'
import { FakeUploader } from 'test/storage/fake-uploader'

import { InvalidImageTypeError } from './errors/invalid-image-type-error'
import { UploadAndCreateImageUseCase } from './upload-and-create-image'

let inMemoryImagesRepository: InMemoryImagesRepository
let fakeUploader: FakeUploader

let sut: UploadAndCreateImageUseCase

describe('Upload and Create Image', () => {
  beforeEach(() => {
    inMemoryImagesRepository = new InMemoryImagesRepository()
    fakeUploader = new FakeUploader()

    sut = new UploadAndCreateImageUseCase(
      inMemoryImagesRepository,
      fakeUploader,
    )
  })

  it('should be able to upload and create an image', async () => {
    const result = await sut.execute({
      fileName: 'screenshot.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      image: inMemoryImagesRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'screenshot.png',
      }),
    )
  })

  it('should not be able to upload image with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'screenshot.pdf',
      fileType: 'image/pdf',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidImageTypeError)
  })
})
