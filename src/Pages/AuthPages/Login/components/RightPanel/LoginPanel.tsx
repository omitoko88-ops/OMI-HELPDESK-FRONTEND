import { AuthHeader } from './AuthHeader'
import { LoginForm } from './LoginForm'
import { MessageBox } from './MessageBox'
import { OAuthProviders } from './OAuthProviders'
import { PanelFooter } from './PanelFooter'

/** Panel kanan: seluruh bagian form login. */
export function LoginPanel() {
  return (
    <div className="relative flex flex-col justify-center bg-white p-8 lg:col-span-7 lg:p-12">
      <AuthHeader />
      <MessageBox />
      <LoginForm />
      <OAuthProviders />
      <PanelFooter />
    </div>
  )
}
