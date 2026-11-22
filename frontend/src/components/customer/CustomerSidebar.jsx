
import React from 'react';
import { NavLink } from 'react-router-dom';

const navigation = [
  { label: 'Overview', path: '/account/dashboard', icon: '◫' },
  { label: 'My Orders', path: '/account/orders', icon: '▤' },
  { label: 'Active Proofs', path: '/account/proofs', icon: '◈' },
  { label: 'Saved Designs', path: '/account/designs', icon: '✎' },
  { label: 'Reorder', path: '/account/reorder', icon: '↻' },
  { label: 'Invoices', path: '/account/invoices', icon: '▧' },
  { label: 'My Profile', path: '/account/profile', icon: '◎' },
  { label: 'Addresses', path: '/account/addresses', icon: '⌖' },
];

const CustomerSidebar = ({
  user,
  onClose,
  className = '',
}) => {
  const displayName =
    user?.fullName || user?.name || user?.email || 'Customer';

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  return (
    <aside className={`flex h-full w-full flex-col bg-[var(--color-surface)] ${className}`}>
      <div className="border-b border-[var(--color-border)] p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-sm font-bold text-white">
            {initials || 'C'}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-[var(--color-heading)]">
              {displayName}
            </p>
            <p className="truncate text-xs text-[var(--color-muted)]">
              {user?.email || 'Customer account'}
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="Customer navigation">
        <p className="px-3 pb-3 pt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          Your workspace
        </p>

        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/account/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
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
      </nav>

      <div className="border-t border-[var(--color-border)] p-4">
        <NavLink
          to="/products"
          onClick={onClose}
          className="flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-semibold text-[var(--color-heading)] transition hover:bg-[var(--color-surface-soft)]"
        >
          <span aria-hidden="true">＋</span>
          Create a new order
        </NavLink>
      </div>
    </aside>
  );
};

export default CustomerSidebar;
