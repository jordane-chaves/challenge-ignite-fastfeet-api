import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

export interface ImageProps {
  title: string
  url: string
}

export class Image extends Entity<ImageProps> {
  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
  }

  static create(props: ImageProps, id?: UniqueEntityID) {
    const image = new Image(props, id)

    return image
  }
}
