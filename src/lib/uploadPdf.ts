import { uploadApi } from '@/lib/api/endpoints'

export async function uploadPdf(file: File): Promise<string> {
  const result = await uploadApi.pdf(file)
  return result.url
}

export async function uploadImage(file: File): Promise<string> {
  const result = await uploadApi.image(file)
  return result.url
}
