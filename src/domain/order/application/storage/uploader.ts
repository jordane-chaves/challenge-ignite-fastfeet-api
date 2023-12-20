export interface UploaderParams {
  fileName: string
  fileType: string
  body: Buffer
}

export interface Uploader {
  upload(params: UploaderParams): Promise<{ url: string }>
}
