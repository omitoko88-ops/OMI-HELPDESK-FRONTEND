import { useAuthContext } from '../../context/AuthContext'
import { AuthMessageBox } from '../../../components/AuthMessageBox'

/** Kotak pesan di atas form. Tidak dirender jika belum ada pesan. */
export function MessageBox() {
  const { alert } = useAuthContext()
  return <AuthMessageBox alert={alert} />
}
