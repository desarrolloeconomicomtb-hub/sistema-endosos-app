'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FileText, Plus, Settings, LayoutDashboard, BarChart3 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Panel Principal', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Nuevo Endoso', href: '/dashboard/endosos/nuevo', icon: Plus },
    { name: 'Estadísticas', href: '/dashboard/estadisticas', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-white text-gray-900 font-sans selection:bg-black selection:text-white print:h-auto print:overflow-visible print:block">
      {/* Sidebar - Notion style */}
      <aside className="w-64 bg-[#fbfbfa] border-r border-gray-200 flex flex-col print:hidden">
        <div className="py-6 flex items-center px-6 border-b border-gray-200/60 mb-2">
          <div className="flex items-center gap-3">
            <img src="/images/escudo-toa-baja.png" alt="Escudo Toa Baja" className="h-12 w-12 object-contain" />
            <div>
              <span className="block text-sm font-bold tracking-tight text-[#1b5e20] uppercase">Sistema Endosos</span>
              <span className="block text-[10px] text-gray-500 uppercase font-semibold tracking-wider">Toa Baja</span>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className={`flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors ${
                  isActive 
                    ? 'bg-gray-200/50 text-black font-medium' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <item.icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-500'}`} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-3">
          <button className="flex items-center gap-3 px-3 py-1.5 w-full text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md transition-colors">
            <Settings className="w-4 h-4" />
            Configuración
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto flex flex-col relative print:overflow-visible print:block">
        <header className="h-16 flex items-center justify-between px-10 print:hidden sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Toa Baja</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">
              {pathname === '/dashboard/endosos/nuevo' ? 'Nuevo Endoso' : 'Panel Principal'}
            </span>
          </div>
        </header>
        <div className="p-10 max-w-5xl mx-auto w-full print:p-0 print:max-w-none">
          {children}
        </div>
      </main>
    </div>
  );
}
