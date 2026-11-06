import { useEffect, useRef } from 'react'
import { LOG_TONE_CLASS } from '../../../../../data/constants'
import type { LogEntry } from '../../types'
import { TerminalInput } from '@/components/inputs'
import { useFormContext } from 'react-hook-form'

interface TerminalConsoleProps {
  logs: LogEntry[]
  onCommand: (command: string) => void
}

export interface TerminalFormValues {
  command: string
}

/** Terminal mini interaktif */
export function TerminalConsole({ logs, onCommand }: TerminalConsoleProps) {
  const logRef = useRef<HTMLDivElement>(null)

  // Ambil control dari FormProvider
  const { control, setValue } = useFormContext<TerminalFormValues>()
 
  // Auto-scroll setiap ada log baru
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logs])

  // Proses command saat Enter ditekan
  const handleCommand = (command: string) => {
    if (!command.trim()) return

    onCommand(command)

    // Kosongkan input setelah command dikirim
    setValue('command', '')
  }

  return (
    <div className="relative z-10 my-auto">
      <div className="rounded-xl border border-slate-700 bg-[#0f172a] p-4 font-mono text-xs shadow-xl">
        {/* Title bar */}
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

        {/* Terminal input */}
        <TerminalInput id="command" control={control} onEnter={handleCommand} />
      </div>
    </div>
  )
}
