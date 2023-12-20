import { Image } from '../../enterprise/entities/image'

export interface ImagesRepository {
  create(image: Image): Promise<void>
}
