import { FormProvider } from 'react-hook-form'
import type { LogEntry } from '../../types'
import { BrandHeader } from './BrandHeader'
import { CircuitPattern } from './CircuitPattern'
import { ShowcaseFooter } from './ShowcaseFooter'
import { TerminalConsole } from './TerminalConsole'
import { useAuthContext } from '../../context/AuthContext'

/** Panel kiri: branding + terminal interaktif. */
export function ShowcasePanel() {
  const {
    TerminalFormMethods: methods,
    logs,
    runCommand,
    showTrivia,
  } = useAuthContext()

  return (
    <div className="relative flex flex-col justify-between overflow-hidden border-b border-slate-300 bg-linear-to-br from-slate-100 to-slate-200/80 p-8 lg:col-span-5 lg:border-r lg:border-b-0">
      <CircuitPattern />
      <BrandHeader />
      <FormProvider {...methods}>
        <TerminalConsole logs={logs} onCommand={runCommand} />
      </FormProvider>
      <ShowcaseFooter onTrivia={showTrivia} />
    </div>
  )
}
