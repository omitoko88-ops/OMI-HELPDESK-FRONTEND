// lib/uploadPdf.ts: sesuaikan dengan endpoint backend-mu
export async function uploadPdf(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const res = await fetch('http://127.0.0.1:8005/api/v1/uploads/pdf', {
    method: 'POST',
    body,
  })
  if (!res.ok) throw new Error('Upload gagal')
  const { url } = await res.json()
  return url
}

export async function uploadImage(file: File): Promise<string> {
  const body = new FormData()
  body.append('file', file)
  const res = await fetch('http://127.0.0.1:8005/api/v1/uploads/image', {
    method: 'POST',
    body,
  })
  if (!res.ok) throw new Error('Upload gagal')
  const { url } = await res.json()
  return url
}
