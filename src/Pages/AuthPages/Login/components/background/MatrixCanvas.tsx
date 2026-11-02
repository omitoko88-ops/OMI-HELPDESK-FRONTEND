import { useRef } from 'react';
import { useMatrixRain } from '../../hooks/useMatrixRain';

interface MatrixCanvasProps {
  active: boolean;
}

/** Canvas efek matrix rain di belakang seluruh halaman. */
export function MatrixCanvas({ active }: MatrixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useMatrixRain(canvasRef, active);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 opacity-15"
    />
  );
}
