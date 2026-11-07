import { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { Workspace } from '../types'
import {
  createWorkspaceSchema,
  renameWorkspaceSchema,
  type WorkspaceNameForm,
} from '@/schemas/WorkspaceSchema'

interface UseWorkspaceFormOptions {
  mode: 'create' | 'rename'
  workspace?: Workspace | null
  onSubmit: (values: WorkspaceNameForm) => Promise<void>
  onOpenChange: (open: boolean) => void
  isPending?: boolean
}

export function useWorkspaceForm({
  mode,
  workspace,
  onSubmit,
  onOpenChange,
  isPending,
}: UseWorkspaceFormOptions) {
  const form = useForm<WorkspaceNameForm>({
    resolver: zodResolver(mode === 'rename' ? renameWorkspaceSchema : createWorkspaceSchema),
    mode: 'onTouched',
    defaultValues: { name: '' },
  })

  useEffect(() => {
    form.reset({ name: mode === 'rename' ? (workspace?.name ?? '') : '' })
  }, [form, mode, workspace?.id, workspace?.name])

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Aksi workspace gagal.')
    }
  })

  return {
    form,
    submit,
    isPending: isPending || form.formState.isSubmitting,
    close: () => onOpenChange(false),
  }
}
