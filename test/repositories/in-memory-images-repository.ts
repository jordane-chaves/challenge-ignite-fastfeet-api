import { ImagesRepository } from '@/domain/order/application/repositories/images-repository'
import { Image } from '@/domain/order/enterprise/entities/image'

export class InMemoryImagesRepository implements ImagesRepository {
  public items: Image[] = []

  async create(image: Image): Promise<void> {
    this.items.push(image)
  }
}
