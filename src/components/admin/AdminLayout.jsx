import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, Users, Settings, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout({ children }) {
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }

  return (
    <div className="min-h-screen bg-[#111318] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0D0D0D] border-r border-[#333539] flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-[#333539]">
          <h1 className="text-[#a4e6ff] font-bold text-xl font-['Space_Grotesk']">
            ClaimCalc Admin
          </h1>
        </div>

        <nav className="flex-1 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg mb-1
                  transition-colors font-['Manrope']
                  ${isActive
                    ? 'bg-[#333539] text-[#a4e6ff]'
                    : 'text-[#bbc9cf] hover:bg-[#1e2024] hover:text-[#e2e2e8]'
                  }
                `}
              >
                <Icon size={20} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-[#333539]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg w-full
                       text-[#bbc9cf] hover:bg-[#1e2024] hover:text-[#e2e2e8]
                       transition-colors font-['Manrope']"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
}
