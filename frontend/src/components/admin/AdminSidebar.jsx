
import React from 'react';
import { NavLink } from 'react-router-dom';

const menuGroups = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: '◫' },
      { label: 'Analytics', path: '/admin/analytics', icon: '▥' },
    ],
  },
  {
    title: 'Order management',
    items: [
      { label: 'All Orders', path: '/admin/orders', icon: '▤' },
      { label: 'Proof Management', path: '/admin/proofs', icon: '◈' },
      { label: 'Production Board', path: '/admin/production', icon: '⚙' },
      { label: 'Completed Jobs', path: '/admin/archive', icon: '✓' },
    ],
  },
  {
    title: 'Store management',
    items: [
      { label: 'Products', path: '/admin/products', icon: '▣' },
      { label: 'Design Templates', path: '/admin/templates', icon: '▧' },
      { label: 'Customers', path: '/admin/customers', icon: '◎' },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Settings', path: '/admin/settings', icon: '⚙' },
    ],
  },
];

const AdminSidebar = ({ onClose, className = '' }) => {
  return (
    <aside className={`flex h-full w-full flex-col bg-[var(--color-surface)] ${className}`}>
      <div className="border-b border-[var(--color-border)] p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          PrintForge
        </p>
        <h2 className="mt-1 text-lg font-extrabold text-[var(--color-heading)]">
          Administration
        </h2>
        <p className="mt-1 text-xs text-[var(--color-muted)]">
          Manage your print operations
        </p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-3" aria-label="Admin navigation">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-[var(--color-primary)] text-white shadow-sm'
                        : 'text-[var(--color-text)] hover:bg-[var(--color-surface-soft)]'
                    }`
                  }
                >
                  <span className="flex h-5 w-5 items-center justify-center text-base" aria-hidden="true">
                    {item.icon}
                  </span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[var(--color-border)] p-4">
        <NavLink
          to="/"
          onClick={onClose}
          className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-heading)] transition hover:bg-[var(--color-surface-soft)]"
        >
          ← Visit storefront
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
