import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api/endpoints'

/**
 * Endpoint admin mengembalikan seluruh workspace di database.
 *
 * Catatan keamanan: pada backend saat ini atribut [Authorize(Roles = "Admin")]
 * masih dikomentari. Halaman ini sengaja tidak ditampilkan di navigasi default;
 * aktifkan lewat VITE_ENABLE_ADMIN_VIEW hanya setelah guard backend tersedia.
 */
export function useAdminWorkspaces(enabled = true) {
  return useQuery({
    queryKey: ['admin', 'workspaces'],
    queryFn: ({ signal }) => adminApi.workspaces(signal),
    enabled,
  })
}
