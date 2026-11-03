import {
  useMutation,
  useQueryClient,
  MutationFunction,
  QueryKey,
  UseQueryOptions,
  useQuery,
} from '@tanstack/react-query'
import { FieldValues, UseFormSetError } from 'react-hook-form'
import { toast } from 'sonner'
import { setErrorFromApi } from './setErrorFromApi'
import { ApiError } from './ApiError'
import { useEffect } from 'react'

interface MutationProps<
  T extends FieldValues = FieldValues,
  TVariables = void,
  TData = unknown,
> {
  mutationFn: MutationFunction<TData, TVariables>
  setError?: UseFormSetError<T>
  // QueryKey[] supaya bisa key bertingkat seperti ["users", id]
  invalidateQueries?: QueryKey[]
  customSuccessMessage?: string
  customErrorMessage?: string
  errorOnToast?: boolean
  onError?: (error: ApiError) => void
  onSuccess?: (data: TData) => void
}

export function useAppMutation<
  T extends FieldValues,
  TVariables = void,
  TData = unknown,
>({
  setError,
  invalidateQueries,
  mutationFn,
  customSuccessMessage,
  customErrorMessage,
  errorOnToast,
  onError,
  onSuccess,
}: MutationProps<T, TVariables, TData>) {
  const queryClient = useQueryClient()

  return useMutation<TData, ApiError, TVariables>({
    mutationFn,
    // async + return Promise.all: mutation baru dianggap selesai
    // setelah data ter-refetch, jadi loading state tidak "bocor"
    onSuccess: async (data) => {
      // Tampilkan toast sukses kalau pesannya diisi
      if (customSuccessMessage) toast.success(customSuccessMessage)

      if (invalidateQueries?.length) {
        await Promise.all(
          invalidateQueries.map((queryKey) =>
            queryClient.invalidateQueries({ queryKey }),
          ),
        )
      }
      onSuccess?.(data)
    },
    onError: (error) => {
      // Jangan log data sensitif; error saja cukup
      if (import.meta.env.DEV)
        console.error(customErrorMessage ?? 'Mutation failed', error)

      if (onError) return onError(error) // pemanggil ambil alih penuh

      if (setError || errorOnToast) {
        setErrorFromApi<T>(error, {
          setError,
          forceToast: errorOnToast,
          customErrorMessage,
        })
      }
    },
  })
}

//!!! APP USE QUERY START HERE
interface ExtraQueryProps {
  customErrorMessage?: string
  errorOnToast?: boolean
}

export function useAppQuery<
  TData = unknown,
  TError = unknown,
  TQueryKey extends QueryKey = QueryKey,
>(props: UseQueryOptions<TData, TError, TData, TQueryKey> & ExtraQueryProps) {
  const { customErrorMessage, errorOnToast, ...baseOptions } = props
  const query = useQuery({ ...baseOptions })

  // Side effect harus di useEffect, bukan di body render,
  // supaya toast hanya muncul sekali per error (bukan tiap re-render)
  useEffect(() => {
    if (query.isError && errorOnToast) {
      toast.error(customErrorMessage || 'Terjadi kesalahan saat mengambil data')
    }
  }, [query.isError, errorOnToast, customErrorMessage])

  return query
}
