import { useCallback, useRef, useState } from 'react'
import {
  INITIAL_LOGS,
  NERD_FACTS,
  TERMINAL_PROMPT,
} from '../../../../data/constants'
import type { AppendLog, LogEntry } from '../types'

interface UseTerminalOptions {
  /** Status matrix saat ini (dipakai untuk pesan perintah `matrix`). */
  matrixActive: boolean
  /** Dipanggil saat perintah `matrix` dijalankan. */
  onToggleMatrix: () => void
}

/** State + logika perintah untuk terminal mini di panel kiri. */
export function useTerminal({
  matrixActive,
  onToggleMatrix,
}: UseTerminalOptions) {
  const [logs, setLogs] = useState<LogEntry[]>(INITIAL_LOGS)
  // Counter id unik untuk key React (mulai setelah id log awal)
  const nextId = useRef(INITIAL_LOGS.length + 1)

  const appendLog = useCallback<AppendLog>((text, tone = 'muted') => {
    const id = nextId.current++
    setLogs((prev) => [...prev, { id, text, tone }])
  }, [])

  const showTrivia = useCallback(() => {
    const fact = NERD_FACTS[Math.floor(Math.random() * NERD_FACTS.length)]
    appendLog(`[TRIVIA] ${fact}`, 'cyan')
  }, [appendLog])

  /** Menjalankan perintah yang diketik user di terminal. */
  const runCommand = (rawInput: string) => {
    const cmd = rawInput.trim().toLowerCase()
    if (!cmd) return

    // Tampilkan perintah yang diketik, seperti terminal asli
    appendLog(`${TERMINAL_PROMPT} ${cmd}`)

    if (cmd === 'help') {
      appendLog(
        "Available commands: 'help', 'clear', 'sudo', 'ping', 'matrix', 'quote', 'whoami'",
      )
    } else if (cmd === 'clear') {
      setLogs([])
    } else if (cmd.startsWith('sudo')) {
      appendLog(
        'Permission denied: User is not in the sudoers file. This incident will be reported.',
        'warning',
      )
    } else if (cmd === 'ping') {
      appendLog(
        'PING localhost (127.0.0.1): 56 data bytes. 0.04 ms response.',
        'accent',
      )
    } else if (cmd === 'matrix') {
      onToggleMatrix()
      appendLog(`Matrix stream toggled to: ${!matrixActive}`)
    } else if (cmd === 'quote' || cmd === 'trivia') {
      showTrivia()
    } else if (cmd === 'whoami') {
      appendLog('guest_developer_node_42')
    } else {
      appendLog(
        `command not recognized: '${cmd}'. Type 'help' for manual.`,
        'warning',
      )
    }
  }

  return { logs, appendLog, runCommand, showTrivia }
}
