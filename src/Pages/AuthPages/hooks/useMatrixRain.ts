import { useEffect, useRef, type RefObject } from 'react'
import { MATRIX_WORDS } from '../../../data/constants'

const FONT_SIZE = 14
// Jarak horizontal antar kolom (sama seperti versi HTML: fontSize * 2.5)
const COLUMN_WIDTH = FONT_SIZE * 2.5
const FRAME_INTERVAL_MS = 50

/**
 * Menggambar efek "matrix rain" pada canvas.
 * - `active = false` -> animasi berhenti dan canvas dibersihkan.
 * - Posisi tiap kolom disimpan di ref supaya tidak reset saat animasi di-toggle.
 */
export function useMatrixRain(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  active: boolean,
) {
  // posisi vertikal (dalam satuan baris) untuk setiap kolom
  const dropsRef = useRef<number[]>([])

  // Ukuran canvas mengikuti ukuran window
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Sesuaikan jumlah kolom, pertahankan posisi kolom yang sudah ada
      const columns = Math.ceil(canvas.width / COLUMN_WIDTH)
      dropsRef.current = Array.from(
        { length: columns },
        (_, i) => dropsRef.current[i] ?? 1,
      )
    }

    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [canvasRef])

  // Loop animasi
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    // Saat dimatikan, bersihkan canvas lalu berhenti
    if (!active) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      return
    }

    const draw = () => {
      // Lapisan semi-transparan menciptakan efek jejak yang memudar
      ctx.fillStyle = 'rgba(241, 245, 249, 0.12)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#0284c7'
      ctx.font = `${FONT_SIZE}px "JetBrains Mono", monospace`

      const drops = dropsRef.current
      for (let i = 0; i < drops.length; i++) {
        const word =
          MATRIX_WORDS[Math.floor(Math.random() * MATRIX_WORDS.length)]
        ctx.fillText(word, i * COLUMN_WIDTH, drops[i] * FONT_SIZE)

        // Kolom yang sudah melewati dasar layar kembali ke atas secara acak
        if (drops[i] * FONT_SIZE > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const intervalId = window.setInterval(draw, FRAME_INTERVAL_MS)
    return () => window.clearInterval(intervalId)
  }, [canvasRef, active])
}
