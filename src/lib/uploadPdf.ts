import { uploadApi } from '@/lib/api/endpoints'
import { apiPath } from '@/lib/api/client'

export async function uploadPdf(file: File): Promise<string> {
  const result = await uploadApi.pdf(file)
  return apiPath(result.url)
}

export async function uploadImage(file: File): Promise<string> {
  const result = await uploadApi.image(file)
  return apiPath(result.url)
}
