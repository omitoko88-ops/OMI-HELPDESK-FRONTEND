import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import {
  createDocumentSchema,
  updateDocumentSchema,
  type CreateDocumentForm,
  type UpdateDocumentForm,
} from '@/schemas/WorkspaceSchema'

interface UseCreateDocumentFormOptions {
  onSubmit: (values: CreateDocumentForm) => Promise<void>
  isPending?: boolean
}

export function useCreateDocumentForm({
  onSubmit,
  isPending,
}: UseCreateDocumentFormOptions) {
  const form = useForm<CreateDocumentForm>({
    resolver: zodResolver(createDocumentSchema),
    mode: 'onTouched',
    defaultValues: { title: '' },
  })

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
      form.reset()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal membuat dokumen.')
    }
  })

  return { form, submit, isPending: isPending || form.formState.isSubmitting }
}

interface UseUpdateDocumentFormOptions {
  title: string
  content: string | null
  onSubmit: (values: UpdateDocumentForm) => Promise<void>
  isPending?: boolean
}

export function useUpdateDocumentForm({
  title,
  content,
  onSubmit,
  isPending,
}: UseUpdateDocumentFormOptions) {
  const form = useForm<UpdateDocumentForm>({
    resolver: zodResolver(updateDocumentSchema),
    mode: 'onTouched',
    defaultValues: { title, content: content ?? '' },
  })

  useEffect(() => {
    form.reset({ title, content: content ?? '' })
  }, [content, form, title])

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan dokumen.')
    }
  })

  return { form, submit, isPending: isPending || form.formState.isSubmitting }
}

interface UsePublicDocumentFormOptions {
  title: string
  content: string | null
  onSubmit: (values: UpdateDocumentForm) => Promise<void>
  isPending?: boolean
}

/** Form edit halaman publik; validasi sama dengan UpdateDocumentDto di API. */
export function usePublicDocumentForm({
  title,
  content,
  onSubmit,
  isPending,
}: UsePublicDocumentFormOptions) {
  return useUpdateDocumentForm({ title, content, onSubmit, isPending })
}
