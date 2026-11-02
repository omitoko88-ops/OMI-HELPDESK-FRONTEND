import { BackgroundEffects } from './components/background/BackgroundEffects'
import { LoginPanel } from './components/RightPanel/LoginPanel'
import { ShowcasePanel } from './components/LeftPanel/ShowcasePanel'
import { AuthContextProvider, useAuthContext } from './context/AuthContext'

/**
 * Halaman login bertema geek.
 * Komponen ini hanya merangkai state dari hooks, lalu membagikannya ke panel kiri & kanan.
 */
function LoginPageContent() {
  const { matrixActive, logs, runCommand, showTrivia } = useAuthContext()

  return (
    // Style yang dulu ada di <body> dipindah ke wrapper ini agar tidak memengaruhi halaman lain
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-geek-bg p-4 font-geek text-geek-text select-none">
      <BackgroundEffects matrixActive={matrixActive} />

      <main className="z-20 my-8 grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-2xl border border-slate-300 bg-white/90 shadow-2xl backdrop-blur-xl lg:grid-cols-12">
        <ShowcasePanel
          logs={logs}
          onCommand={runCommand}
          onTrivia={showTrivia}
        />
        <LoginPanel />
      </main>
    </div>
  )
}

export default function LoginPage() {
  return (
    <AuthContextProvider>
      <LoginPageContent />
    </AuthContextProvider>
  )
}
