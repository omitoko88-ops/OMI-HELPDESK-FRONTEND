import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { memberEmailSchema, type MemberEmailForm } from '@/schemas/WorkspaceSchema'

interface UseMemberFormOptions {
  onSubmit: (values: MemberEmailForm) => Promise<void>
  isPending?: boolean
}

export function useMemberForm({ onSubmit, isPending }: UseMemberFormOptions) {
  const form = useForm<MemberEmailForm>({
    resolver: zodResolver(memberEmailSchema),
    mode: 'onTouched',
    defaultValues: { email: '', role: 'Editor' },
  })

  const submit = form.handleSubmit(async (values) => {
    try {
      await onSubmit(values)
      form.reset({ email: '', role: values.role })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menambah anggota.')
    }
  })

  return { form, submit, isPending: isPending || form.formState.isSubmitting }
}
