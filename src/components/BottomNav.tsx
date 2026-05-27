import { Home, CreditCard, Plus, PieChart, Settings } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

export function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  const isActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true
    if (path !== '/' && currentPath.startsWith(path)) return true
    return false
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="max-w-lg mx-auto flex items-center justify-around h-16 px-2">
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center justify-center gap-0.5 w-16 ${isActive('/') ? 'text-blue-900' : 'text-gray-400'}`}
        >
          <Home className="w-5 h-5" strokeWidth={isActive('/') ? 2.5 : 1.5} />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={() => navigate('/transactions')}
          className={`flex flex-col items-center justify-center gap-0.5 w-16 ${isActive('/transactions') ? 'text-blue-900' : 'text-gray-400'}`}
        >
          <CreditCard className="w-5 h-5" strokeWidth={isActive('/transactions') ? 2.5 : 1.5} />
          <span className="text-[10px] font-medium">Transactions</span>
        </button>

        <button
          onClick={() => navigate('/add')}
          className="flex items-center justify-center w-14 h-14 bg-blue-900 rounded-full -mt-6 shadow-lg shadow-blue-900/30 active:scale-95 transition-transform"
        >
          <Plus className="w-6 h-6 text-white" strokeWidth={2.5} />
        </button>

        <button
          onClick={() => navigate('/statistics')}
          className={`flex flex-col items-center justify-center gap-0.5 w-16 ${isActive('/statistics') ? 'text-blue-900' : 'text-gray-400'}`}
        >
          <PieChart className="w-5 h-5" strokeWidth={isActive('/statistics') ? 2.5 : 1.5} />
          <span className="text-[10px] font-medium">Statistics</span>
        </button>

        <button
          onClick={() => navigate('/settings')}
          className={`flex flex-col items-center justify-center gap-0.5 w-16 ${isActive('/settings') ? 'text-blue-900' : 'text-gray-400'}`}
        >
          <Settings className="w-5 h-5" strokeWidth={isActive('/settings') ? 2.5 : 1.5} />
          <span className="text-[10px] font-medium">Settings</span>
        </button>
      </div>
    </div>
  )
}
