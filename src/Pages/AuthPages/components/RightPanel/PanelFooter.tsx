import { FaServer } from 'react-icons/fa6'
import { useAuthContext } from '../../context/AuthContext'


/** Info versi dokumentasi dan status cluster. */
export function PanelFooter() {
  const { handleClusterInfo } = useAuthContext()
  return (
    <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4 text-center font-mono text-[11px] text-slate-500">
      <span>
        Docs Version: <strong className="text-slate-800">v2.1.0-rc3</strong>
      </span>
      <button
        type="button"
        onClick={handleClusterInfo}
        className="flex items-center transition-colors hover:text-geek-accent"
      >
        <FaServer className="mr-1" /> Cluster Normal
      </button>
    </div>
  )
}
