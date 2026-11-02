import type { LogEntry, LogTone } from '../Pages/AuthPages/types'

export const TERMINAL_PROMPT = 'system@devdocs:~$'

// Password minimal agar simulasi login dianggap berhasil
export const MIN_PASSWORD_LENGTH = 4

// Kata-kata yang "hujan" di background matrix
export const MATRIX_WORDS =
  '01101001 01001100 01001111 01010110 01000101 HTML CSS JS REACT PYTHON RUST GOLANG C++ KUBERNETES GIT DOCKER API SQL'.split(
    ' ',
  )

export const NERD_FACTS = [
  "HTTP 418 state code means 'I'm a teapot'.",
  'The first computer bug was an actual moth found in 1947.',
  'Git was created by Linus Torvalds in just 10 days.',
  "There are only 10 types of people: those who understand binary, and those who don't.",
  'CSS flexbox was designed to eliminate table layout hacks from the early 2000s.',
]

// Kelas Tailwind untuk setiap nuansa warna log (ditulis utuh agar terdeteksi Tailwind)
export const LOG_TONE_CLASS: Record<LogTone, string> = {
  muted: 'text-slate-300',
  warning: 'text-rose-400',
  accent: 'text-emerald-400',
  cyan: 'text-cyan-400',
  indigo: 'text-indigo-400',
}

// Isi awal terminal saat halaman pertama kali dibuka
export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 1,
    label: TERMINAL_PROMPT,
    labelTone: 'indigo',
    text: 'init_security_protocol --level=light',
    tone: 'muted',
  },
  {
    id: 2,
    label: '[OK]',
    labelTone: 'cyan',
    text: 'RSA 4096-bit Keys Loaded',
    tone: 'muted',
  },
  {
    id: 3,
    label: '[OK]',
    labelTone: 'cyan',
    text: 'Light Mode UI Rendered',
    tone: 'muted',
  },
  {
    id: 4,
    label: '[INFO]',
    labelTone: 'accent',
    text: 'Waiting for developer clearance...',
    tone: 'muted',
  },
]
