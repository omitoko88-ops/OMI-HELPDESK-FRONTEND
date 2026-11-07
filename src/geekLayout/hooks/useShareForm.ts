import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { DocumentShareDto } from '@/lib/api/types'
import { shareSettingsSchema, type ShareSettingsForm } from '@/schemas/WorkspaceSchema'

interface UseShareFormOptions {
  share?: DocumentShareDto
  onSubmit: (values: ShareSettingsForm) => Promise<void>
  isPending?: boolean
}

export function useShareForm({ share, onSubmit, isPending }: UseShareFormOptions) {
  const form = useForm<ShareSettingsForm>({
    resolver: zodResolver(shareSettingsSchema),
    mode: 'onTouched',
    defaultValues: { isEnabled: false, role: 'Viewer', expiresAt: '' },
  })

  useEffect(() => {
    if (!share) return
    form.reset({
      isEnabled: share.isEnabled,
      role: share.role,
      expiresAt: share.expiresAt ? share.expiresAt.slice(0, 16) : '',
    })
  }, [form, share])

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
      toast.success('Pengaturan link disimpan.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menyimpan link.')
    }
  })

  return { form, submit, isPending: isPending || form.formState.isSubmitting }
}
