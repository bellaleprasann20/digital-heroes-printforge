
import React from 'react';
import { NavLink, Link } from 'react-router-dom';

const customerGroups = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/account/dashboard', icon: '⌂', end: true },
    ],
  },
  {
    title: 'MY WORKSPACE',
    items: [
      { label: 'My Orders', path: '/account/orders', icon: '▤' },
      { label: 'Active Proofs', path: '/account/proofs', icon: '◈' },
      { label: 'Saved Designs', path: '/account/designs', icon: '✎' },
      { label: 'Reorder', path: '/account/reorder', icon: '↻' },
    ],
  },
  {
    title: 'ACCOUNT',
    items: [
      { label: 'My Profile', path: '/account/profile', icon: '◎' },
      { label: 'Addresses', path: '/account/addresses', icon: '⌖' },
    ],
  },
];

const adminGroups = [
  {
    title: 'OVERVIEW',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: '⌂', end: true },
      { label: 'Analytics', path: '/admin/analytics', icon: '▥' },
    ],
  },
  {
    title: 'PRODUCTION',
    items: [
      { label: 'Orders', path: '/admin/orders', icon: '▤' },
      { label: 'Artwork & Proofs', path: '/admin/proofs', icon: '◈' },
      { label: 'Production Jobs', path: '/admin/production', icon: '⚙' },
      { label: 'File Archive', path: '/admin/archive', icon: '▣' },
    ],
  },
  {
    title: 'CATALOGUE',
    items: [
      { label: 'Products', path: '/admin/products', icon: '▦' },
      { label: 'Templates', path: '/admin/templates', icon: '▧' },
    ],
  },
  {
    title: 'MANAGEMENT',
    items: [
      { label: 'Customers', path: '/admin/customers', icon: '♙' },
      { label: 'Settings', path: '/admin/settings', icon: '⚙' },
    ],
  },
];

export default function Sidebar({
  variant = 'customer',
  isOpen = false,
  onClose,
  user = null,
}) {
  const isAdmin = variant === 'admin';
  const groups = isAdmin ? adminGroups : customerGroups;

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/45 lg:hidden"
        />
      )}

      <aside
        className={[
          'fixed bottom-0 left-0 top-0 z-50 flex w-[270px] flex-col',
          'border-r border-[var(--color-border)] bg-white',
          'transition-transform duration-300 ease-in-out',
          'lg:sticky lg:top-0 lg:z-10 lg:h-screen lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        ].join(' ')}
      >
        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-[var(--color-border)] px-5">
          <Link to="/" onClick={onClose} className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-primary)] text-sm font-extrabold text-white">
              DH
            </span>
            <span className="text-sm font-extrabold tracking-tight text-[var(--color-heading)]">
              DIGITAL HEROES
            </span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-xl text-[var(--color-muted)] hover:bg-[var(--color-surface-soft)] lg:hidden"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-6 rounded-xl bg-[var(--color-surface-soft)] p-4">
            <p className="text-[10px] font-bold tracking-[0.16em] text-[var(--color-muted)]">
              {isAdmin ? 'ADMIN WORKSPACE' : 'CUSTOMER WORKSPACE'}
            </p>
            <p className="mt-2 truncate text-sm font-bold text-[var(--color-heading)]">
              {user?.name || user?.fullName || (isAdmin ? 'Administrator' : 'Welcome back')}
            </p>
            <p className="mt-0.5 truncate text-xs text-[var(--color-muted)]">
              {user?.email || (isAdmin ? 'Manage your print business' : 'Manage your print orders')}
            </p>
          </div>

          <nav aria-label={isAdmin ? 'Admin navigation' : 'Customer navigation'}>
            {groups.map((group) => (
              <div key={group.title} className="mb-7">
                <p className="mb-3 px-3 text-[10px] font-bold tracking-[0.15em] text-[var(--color-muted)]">
                  {group.title}
                </p>

                <div className="space-y-1">
                  {group.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        [
                          'flex items-center gap-3 rounded-lg px-3 py-3',
                          'text-sm font-semibold transition-all duration-200',
                          isActive
                            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]'
                            : 'text-[var(--color-text)] hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-heading)]',
                        ].join(' ')
                      }
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center text-lg">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        <div className="shrink-0 border-t border-[var(--color-border)] p-4">
          <Link
            to="/"
            onClick={onClose}
            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-[var(--color-text)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)]"
          >
            <span className="text-lg">↗</span>
            Back to website
          </Link>
        </div>
      </aside>
    </>
  );
}
