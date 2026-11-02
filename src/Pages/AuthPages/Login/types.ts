// Tipe-tipe yang dipakai bersama oleh hooks dan komponen halaman login.

/** Warna/nuansa teks pada baris log terminal. */
export type LogTone = 'muted' | 'warning' | 'accent' | 'cyan' | 'indigo';

/** Satu baris di terminal log. `label` adalah prefix berwarna (mis. "[OK]"). */
export interface LogEntry {
  id: number;
  text: string;
  tone: LogTone;
  label?: string;
  labelTone?: LogTone;
}

/** Jenis pesan pada kotak alert di atas form. */
export type AlertType = 'error' | 'success' | 'info';

export interface AlertState {
  type: AlertType;
  text: string;
}

/** Status proses login: idle -> loading -> success (atau kembali idle jika gagal). */
export type LoginStatus = 'idle' | 'loading' | 'success';

// Signature fungsi yang dibagikan antar hooks/komponen
export type AppendLog = (text: string, tone?: LogTone) => void;
export type ShowMessage = (text: string, type?: AlertType) => void;
