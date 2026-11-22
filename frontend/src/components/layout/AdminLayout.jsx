
import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout({ user = null, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitles = {
    '/admin/dashboard': 'Overview',
    '/admin/analytics': 'Analytics & Reports',
    '/admin/orders': 'Order Management',
    '/admin/proofs': 'Artwork & Proofs',
    '/admin/production': 'Production Pipeline',
    '/admin/archive': 'Production Archive',
    '/admin/products': 'Product Management',
    '/admin/templates': 'Design Templates',
    '/admin/customers': 'Customer Management',
    '/admin/settings': 'Settings',
  };

  const pageTitle = pageTitles[location.pathname] || 'Admin Workspace';

  return (
    <div className="flex min-h-screen bg-[#f5f5f2]">
      <Sidebar
        variant="admin"
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[var(--color-border)] bg-white/95 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open admin navigation"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-xl text-[var(--color-heading)] hover:bg-[var(--color-surface-soft)] lg:hidden"
            >
              ☰
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--color-heading)] sm:text-base">
                {pageTitle}
              </p>
              <p className="hidden text-xs text-[var(--color-muted)] sm:block">
                Digital Heroes · Administration
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden rounded-full bg-[#e7f5ed] px-3 py-1.5 text-[10px] font-bold tracking-wide text-[#25845b] sm:inline-flex">
              ADMINISTRATOR
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-heading)] text-sm font-bold text-white">
              {(user?.name || user?.fullName || 'A').charAt(0).toUpperCase()}
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="hidden rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-bold text-[var(--color-text)] transition-colors hover:border-red-300 hover:text-red-600 sm:block"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-9">
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>

        <footer className="border-t border-[var(--color-border)] bg-white px-5 py-4 text-center text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} Digital Heroes. Admin Workspace.
        </footer>
      </div>
    </div>
  );
}
