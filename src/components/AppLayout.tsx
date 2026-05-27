import { BottomNav } from './BottomNav'
import type { ReactNode } from 'react'

interface AppLayoutProps {
  children: ReactNode
  hideNav?: boolean
}

export function AppLayout({ children, hideNav }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 max-w-lg mx-auto relative">
      <main className={`pb-20 ${hideNav ? '' : ''}`}>
        {children}
      </main>
      {!hideNav && <BottomNav />}
    </div>
  )
}
