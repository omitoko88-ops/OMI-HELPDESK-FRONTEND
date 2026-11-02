import { MatrixCanvas } from './MatrixCanvas'

interface BackgroundEffectsProps {
  matrixActive: boolean
}

/** Semua elemen dekoratif di belakang kartu login: matrix, grid, dan blob neon. */
export function BackgroundEffects({ matrixActive }: BackgroundEffectsProps) {
  return (
    <>
      <MatrixCanvas active={matrixActive} />

      {/* Pola grid teknis */}
      <div
        aria-hidden="true"
        className="tech-grid pointer-events-none absolute inset-0 z-0"
      />

      {/* Blob cahaya ambient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-geek-secondary opacity-40 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-geek-cyan opacity-30 blur-[150px]"
      />
    </>
  )
}
