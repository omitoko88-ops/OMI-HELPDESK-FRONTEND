// Re-export the single API error implementation used by the fetch client.
// Keeping this path for compatibility avoids two different `instanceof`
// checks depending on which module imported the class.
export { ApiError, flattenErrors } from './api/ApiError'
export type { ApiError as ApiErrorType } from './api/ApiError'
