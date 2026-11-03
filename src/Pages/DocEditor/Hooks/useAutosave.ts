import { useCallback, useEffect, useRef } from 'react'
import { ApiError } from '@/lib/api/ApiError'
import { useDocUiStore } from '@/stores/docUiStore'

export interface SavePayload {
  title: string
  content: string
}

interface Options {
  enabled: boolean // false = pengguna hanya boleh membaca
  delay?: number // jeda debounce (ms)
  onSave: (p: SavePayload) => Promise<unknown>
}

// Autosave dengan debounce. Menjamin:
// - hanya satu request berjalan sekaligus (perubahan baru menunggu giliran, tidak hilang)
// - sisa perubahan di-flush saat pindah halaman / tutup tab
// - gagal jaringan/500 dicoba ulang otomatis; 401/403/404 TIDAK diulang (hak akses berubah)
export function useAutosave({ enabled, delay = 1500, onSave }: Options) {
  const setStatus = useDocUiStore((s) => s.setSaveStatus)
  const pending = useRef<SavePayload | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const saving = useRef(false)
  const denied = useRef(false)
  // Simpan onSave terbaru di ref agar flush tidak memakai closure usang
  const saveRef = useRef(onSave)
  saveRef.current = onSave

  const flush = useCallback(async () => {
    clearTimeout(timer.current)
    timer.current = undefined // tanda "tidak ada timer aktif" untuk pengecekan di finally
    if (!pending.current || saving.current || denied.current) return
    const payload = pending.current
    pending.current = null
    saving.current = true
    setStatus('saving')
    try {
      await saveRef.current(payload)
      setStatus(pending.current ? 'dirty' : 'saved')
    } catch (e) {
      if (e instanceof ApiError && [401, 403, 404].includes(e.status)) {
        // Hak akses dicabut / halaman dihapus: berhenti menyimpan, jangan loop
        denied.current = true
        setStatus('denied')
      } else {
        // Kembalikan payload (kecuali sudah ada yang lebih baru) lalu coba lagi
        pending.current ??= payload
        setStatus('error')
        timer.current = setTimeout(flush, 5000)
      }
    } finally {
      saving.current = false
      // Ada ketikan baru selama request berjalan -> jadwalkan lagi
      if (pending.current && !denied.current && !timer.current) timer.current = setTimeout(flush, delay)
    }
  }, [delay, setStatus])

  const schedule = useCallback(
    (payload: SavePayload) => {
      if (!enabled || denied.current) return
      pending.current = payload
      setStatus('dirty')
      clearTimeout(timer.current)
      timer.current = setTimeout(flush, delay)
    },
    [enabled, delay, flush, setStatus],
  )

  useEffect(() => {
    // Peringatan bila masih ada perubahan yang belum terkirim
    const warn = (e: BeforeUnloadEvent) => {
      if (pending.current || saving.current) e.preventDefault()
    }
    window.addEventListener('beforeunload', warn)
    return () => {
      window.removeEventListener('beforeunload', warn)
      void flush() // simpan sisa perubahan saat komponen ditutup
      setStatus('idle')
    }
  }, [flush, setStatus])

  return { schedule, flush }
}
