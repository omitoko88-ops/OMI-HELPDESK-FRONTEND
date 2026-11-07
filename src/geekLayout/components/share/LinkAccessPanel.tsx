import { useState } from 'react'
import { toast } from 'sonner'
import { useWorkspaceContext } from '../../context/WorkspaceContext'
import { useShareForm } from '../../hooks/useShareForm'
import { Icon } from '../ui/Icon'

interface LinkAccessPanelProps {
  documentId: string
}

export function LinkAccessPanel({ documentId }: LinkAccessPanelProps) {
  const { canWrite, share, shareQuery } = useWorkspaceContext()
  const [copied, setCopied] = useState(false)

  const form = useShareForm({
    share: shareQuery.data,
    isPending: share.save.isPending,
    onSubmit: async ({ isEnabled, role, expiresAt }) => {
      await share.save.mutateAsync({
        isEnabled,
        role,
        expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
      })
    },
  })

  const isEnabled = form.form.watch('isEnabled')
  const token = shareQuery.data?.token ?? null
  const url = share.shareUrl(token)
  const isBusy = share.save.isPending || share.regenerate.isPending || share.remove.isPending

  const copy = async () => {
    if (!url || !isEnabled) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      window.alert(`Salin URL berikut:\n${url}`)
    }
  }

  const regenerate = async () => {
    if (!window.confirm('Token lama akan langsung tidak berlaku. Lanjutkan?')) return
    try {
      await share.regenerate.mutateAsync()
      toast.success('Token berhasil dibuat ulang.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal membuat ulang token.')
    }
  }

  const remove = async () => {
    if (!window.confirm('Hapus pengaturan link berbagi?')) return
    try {
      await share.remove.mutateAsync()
      toast.success('Link berbagi dihapus.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gagal menghapus link.')
    }
  }

  if (!canWrite) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-[11px] text-amber-800">
        Hanya owner atau editor workspace yang dapat mengatur link publik.
      </div>
    )
  }

  if (shareQuery.isLoading) {
    return <div className="h-28 animate-pulse rounded-xl bg-slate-100" />
  }

  if (shareQuery.isError) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-3.5 text-[11px] text-rose-700">
        {shareQuery.error instanceof Error
          ? shareQuery.error.message
          : 'Gagal memuat pengaturan link publik.'}
      </div>
    )
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        void form.submit()
      }}
      className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-3.5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Icon name="link" className="text-sm text-geek-cyan" />
          <div>
            <div className="font-bold text-slate-800">Public Link Access</div>
            <div className="text-[10px] text-slate-500">
              Siapa pun dengan link dapat mengakses dokumen ini
            </div>
          </div>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isEnabled}
          disabled={isBusy}
          onClick={() => {
            form.form.setValue('isEnabled', !isEnabled, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }}
          className="flex items-center gap-2 text-[11px] font-bold text-slate-700 disabled:opacity-50"
        >
          <span
            className={`relative h-4 w-7 rounded-full transition-colors ${
              isEnabled ? 'bg-emerald-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`absolute top-0.5 h-3 w-3 rounded-full bg-white transition-all ${
                isEnabled ? 'left-3.5' : 'left-0.5'
              }`}
            />
          </span>
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <label className="space-y-1">
          <span className="block text-[10px] font-bold uppercase text-slate-500">Role</span>
          <select
            disabled={isBusy}
            {...form.form.register('role')}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-800 outline-none focus:border-geek-cyan disabled:opacity-60"
          >
            <option value="Viewer">Viewer (Read Only)</option>
            <option value="Editor">Editor (Can Modify)</option>
          </select>
        </label>

        <label className="space-y-1">
          <span className="block text-[10px] font-bold uppercase text-slate-500">Expires</span>
          <input
            type="datetime-local"
            disabled={isBusy}
            {...form.form.register('expiresAt')}
            className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-800 outline-none focus:border-geek-cyan disabled:opacity-60"
          />
        </label>
      </div>

      {form.form.formState.errors.expiresAt && (
        <p className="text-[10px] font-bold text-rose-600">
          {form.form.formState.errors.expiresAt.message}
        </p>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          readOnly
          value={url || (token ? 'Link dinonaktifkan' : 'Aktifkan untuk membuat token')}
          className="w-full select-all rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-[11px] text-slate-600"
        />
        <button
          type="button"
          onClick={() => void copy()}
          disabled={!url || !isEnabled}
          className="shrink-0 rounded-lg bg-slate-900 px-3 py-1.5 font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-40"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
        <span className="max-w-[55%] truncate font-mono">
          Token: {token ?? 'belum dibuat'}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={
              isBusy || !form.form.formState.isDirty
            }
            className="font-bold text-geek-secondary hover:underline disabled:opacity-40"
          >
            {share.save.isPending ? 'Saving...' : 'Save access'}
          </button>
          <button
            type="button"
            onClick={() => void regenerate()}
            disabled={!token || isBusy}
            className="font-bold text-geek-secondary hover:underline disabled:opacity-40"
          >
            Regenerate
          </button>
          <button
            type="button"
            onClick={() => void remove()}
            disabled={!token || isBusy}
            className="font-bold text-rose-600 hover:underline disabled:opacity-40"
          >
            Delete link
          </button>
        </div>
      </div>

      <p className="font-mono text-[9px] text-slate-400">
        Document: {documentId}
      </p>
    </form>
  )
}
