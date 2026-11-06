import { BackgroundEffects } from '../Login/components/background/BackgroundEffects'
import { RegisterContextProvider } from './context/AuthContext'
import { useRegisterContext } from './context/AuthContext'
import { RegisterPanel } from './components/RegisterPanel'
import { RegisterShowcase } from './components/RegisterShowcase'

function RegisterPageContent() {
  const { matrixActive } = useRegisterContext()

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-geek-bg p-4 font-geek text-geek-text select-none">
      <BackgroundEffects matrixActive={matrixActive} />

      <main className="z-20 my-8 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-300 bg-white/90 shadow-2xl backdrop-blur-xl lg:grid-cols-12">
        <RegisterShowcase />
        <RegisterPanel />
      </main>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <RegisterContextProvider>
      <RegisterPageContent />
    </RegisterContextProvider>
  )
}
