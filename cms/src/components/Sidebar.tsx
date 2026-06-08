'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/activities', label: 'Kegiatan', icon: '📋' },
  { href: '/dashboard/volunteers', label: 'Monitoring Relawan', icon: '👥' },
  { href: '/dashboard/users', label: 'Manajemen User', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-emerald-900 to-teal-900 flex flex-col shadow-xl z-40">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-400 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <span className="text-white text-lg">🌿</span>
          </div>
          <div>
            <p className="text-white font-bold leading-tight">RelawanDesa</p>
            <p className="text-emerald-400 text-xs">Smart Village Admin</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : 'text-emerald-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info & Logout */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="px-4 py-3 bg-white/5 rounded-xl mb-2">
          <p className="text-white text-sm font-medium truncate">{user?.name}</p>
          <p className="text-emerald-400 text-xs truncate">{user?.email}</p>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all duration-200"
        >
          <span>🚪</span> Keluar
        </button>
      </div>
    </aside>
  );
}
