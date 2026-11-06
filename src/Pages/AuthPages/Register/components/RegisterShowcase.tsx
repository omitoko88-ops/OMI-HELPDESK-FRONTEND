import { FaFingerprint, FaKey, FaServer } from 'react-icons/fa6'
import { BrandHeader } from '../../Login/components/LeftPanel/BrandHeader'
import { CircuitPattern } from '../../Login/components/LeftPanel/CircuitPattern'

const ENROLLMENT_STEPS = [
  { icon: FaFingerprint, label: 'Identity verification' },
  { icon: FaKey, label: 'Credential encryption' },
  { icon: FaServer, label: 'Workspace provisioning' },
]

export function RegisterShowcase() {
  return (
    <div className="relative flex flex-col justify-between overflow-hidden border-b border-slate-300 bg-linear-to-br from-slate-100 to-slate-200/80 p-8 lg:col-span-5 lg:border-r lg:border-b-0">
      <CircuitPattern />
      <BrandHeader />

      <div className="relative z-10 my-auto py-6">
        <p className="mb-4 font-mono text-[11px] font-bold tracking-widest text-slate-500 uppercase">
          {'// Enrollment protocol'}
        </p>
        <ol className="space-y-3">
          {ENROLLMENT_STEPS.map(({ icon: Icon, label }, index) => (
            <li
              key={label}
              className="flex items-center gap-3 rounded-xl border border-slate-300/80 bg-white/55 p-3 backdrop-blur-sm"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-geek-accent/30 bg-geek-accent/10 text-geek-accent">
                <Icon className="text-sm" />
              </span>
              <div>
                <span className="block font-mono text-[10px] text-slate-400">
                  STEP_0{index + 1}
                </span>
                <span className="font-mono text-xs font-semibold text-slate-700">
                  {label}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative z-10 mt-6 flex items-center justify-between border-t border-slate-300 pt-4 font-mono text-xs">
        <span className="text-slate-600">
          Status:{' '}
          <span className="font-bold text-geek-accent">● ENROLLMENT OPEN</span>
        </span>
        <span className="text-[10px] font-semibold text-geek-cyan">
          RSA / AES-256
        </span>
      </div>
    </div>
  )
}
