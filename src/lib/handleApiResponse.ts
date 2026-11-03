import axios from 'axios'
import { ApiError } from './ApiError'
import { ApiResponse } from '../interfaces/ApiResponse'

export function handleApiResponse<T>(
  response: ApiResponse<T>,
  defaultMessage = 'Terjadi kesalahan',
): ApiResponse<T> {
  if (!response.meta.success) {
    const { message, code } = response.meta

    if (typeof message === 'string') {
      console.log('handleApiResponse PESAN')
      throw new ApiError(message, code)
    }

    // Jika message adalah objek field errors
    console.log('handleApiResponse FIELD')
    throw new ApiError(defaultMessage, code, message)
  }

  return response
}

export function toApiError(
  error: unknown,
  defaultMessage = 'Terjadi kesalahan yang tidak diketahui',
): ApiError {
  // Kalau sudah berupa ApiError (hasil throw dari handleApiResponse),
  // lempar apa adanya agar code & field errors tidak hilang
  if (error instanceof ApiError) {
    return error
  }

  // MULAI PARSING ERROR CATCH
  // ERROR CATCH PASTI BENTUKNYA NANTI AXIOS ERROR, KALAU TIDAK ITU PASTI HASIL THROW YANG DISENGAJA DARI FUNCTION HANDLEAPIRESPONSE DIATAS
  if (axios.isAxiosError(error)) {
    console.log('parsingApiResponse ERROR AXIOS')

    // AMBIL RESPONSE DARI API
    const responseData = error.response?.data
    // console.log("ERROR = ", responseData); //BUKA INI UNTUK LIHAT ISI ERROR API
    if (responseData && responseData.meta) {
      // CEK APAKAH ADA RESPONSE & META DATA
      console.log('parsingApiResponse ERROR API META')
      // throw ApiError langsung KE HANDLEAPI RESPONSE BIAR DIBENTUK JADI TYPE API ERROR
      handleApiResponse(responseData, defaultMessage)
    }

    // ERROR AXIOS TAPI BUKAN DARI API MASUK KESINI KARNA GADAK META RESPON NYA
    throw new ApiError(
      error.response?.statusText || `${defaultMessage}. ${error.message}`,
      error.response?.status || 500,
    )
  }

  // JAGA JAGA KALAU ADA ERROR SELAIN AXIOS ERROR
  if (error instanceof Error) {
    console.log(
      'parsingApiResponse INSTANCE ERROR BUKAN AXIOS BUKAN APIERROR',
      error,
    )
    throw new ApiError(error.message)
  }

  console.log('parsingApiResponse DEFAULT MESSAGE')
  throw new ApiError(defaultMessage)
}
