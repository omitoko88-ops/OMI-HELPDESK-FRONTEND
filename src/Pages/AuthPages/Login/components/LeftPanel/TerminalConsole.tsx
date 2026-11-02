import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { LOG_TONE_CLASS } from '../../../../../data/constants'
import type { LogEntry } from '../../types'

interface TerminalConsoleProps {
  logs: LogEntry[]
  onCommand: (command: string) => void
}

/** Terminal mini interaktif (tema gelap agar kontras dengan panel terang). */
export function TerminalConsole({ logs, onCommand }: TerminalConsoleProps) {
  const [input, setInput] = useState('')
  const logRef = useRef<HTMLDivElement>(null)

  // Auto-scroll ke baris terbaru setiap ada log baru
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    onCommand(input)
    setInput('')
  }

  return (
    <div className="relative z-10 my-auto">
      <div className="rounded-xl border border-slate-700 bg-[#0f172a] p-4 font-mono text-xs shadow-xl">
        {/* Title bar ala macOS */}
        <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-yellow-500" />
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-green-500" />
          </div>
          <span className="text-[10px] text-slate-400">bash - 80x24</span>
        </div>

        {/* Output log */}
        <div
          ref={logRef}
          className="terminal-scroll h-36 space-y-1.5 overflow-y-auto text-slate-300"
        >
          {logs.map((log) => (
            <div key={log.id} className={LOG_TONE_CLASS[log.tone]}>
              {log.label && (
                <>
                  <span className={LOG_TONE_CLASS[log.labelTone ?? 'muted']}>
                    {log.label}
                  </span>{' '}
                </>
              )}
              {log.text}
            </div>
          ))}
        </div>

        {/* Input perintah */}
        <div className="mt-3 flex items-center gap-1.5 border-t border-slate-800 pt-2 text-emerald-400">
          <span>&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type 'help' or commands..."
            aria-label="Terminal command"
            autoComplete="off"
            spellCheck={false}
            className="w-full border-none bg-transparent font-mono text-xs text-emerald-400 outline-none placeholder:text-slate-500 focus:ring-0"
          />
          <span className="animate-blink font-bold text-emerald-400">_</span>
        </div>
      </div>
    </div>
  )
}
