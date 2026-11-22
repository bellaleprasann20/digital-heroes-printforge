
import React from 'react';

const formatDate = (date) => {
  if (!date) return '—';

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return '—';

  return parsed.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const UserTable = ({
  users = [],
  loading = false,
  error = null,
  onView,
  onUpdateStatus,
  onRetry,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 ${className}`}>
        <div className="h-6 w-40 animate-pulse rounded bg-[var(--color-surface-soft)]" />
        <div className="mt-6 space-y-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="h-14 animate-pulse rounded-lg bg-[var(--color-surface-soft)]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`rounded-2xl border border-red-200 bg-red-50 p-6 ${className}`}>
        <p className="font-semibold text-red-700">Unable to load customers</p>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  return (
    <section className={`overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] p-5">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-heading)]">
            Customers
          </h2>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Manage customer accounts and access status.
          </p>
        </div>

        <span className="rounded-full bg-[var(--color-surface-soft)] px-3 py-1.5 text-xs font-semibold text-[var(--color-muted)]">
          {users.length} users
        </span>
      </div>

      {users.length === 0 ? (
        <div className="px-5 py-12 text-center">
          <div className="text-3xl" aria-hidden="true">◎</div>
          <h3 className="mt-3 font-semibold text-[var(--color-heading)]">
            No customers found
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Customer accounts will appear here when registered.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="bg-[var(--color-surface-soft)] text-xs uppercase tracking-wider text-[var(--color-muted)]">
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Role</th>
                <th className="px-5 py-4 font-semibold">Joined</th>
                <th className="px-5 py-4 font-semibold">Orders</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[var(--color-border)]">
              {users.map((user, index) => {
                const id = user.id || user._id;
                const name = user.fullName || user.name || 'Unnamed customer';
                const status = String(user.status || (user.isActive === false ? 'inactive' : 'active')).toLowerCase();
                const active = ['active', 'verified'].includes(status);

                const initials = name
                  .split(' ')
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((part) => part[0].toUpperCase())
                  .join('');

                return (
                  <tr key={id || index} className="transition hover:bg-[var(--color-surface-soft)]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-xs font-bold text-[var(--color-primary)]">
                          {initials || 'U'}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[var(--color-heading)]">
                            {name}
                          </p>
                          <p className="truncate text-xs text-[var(--color-muted)]">
                            {user.email || 'No email available'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-full bg-[var(--color-surface-soft)] px-3 py-1 text-xs font-semibold capitalize text-[var(--color-text)]">
                        {user.role || 'customer'}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[var(--color-muted)]">
                      {formatDate(user.createdAt || user.joinedAt)}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-[var(--color-heading)]">
                      {Number(user.orderCount ?? user.totalOrders ?? 0).toLocaleString('en-IN')}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                        active
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {onView && (
                          <button
                            type="button"
                            onClick={() => onView(user)}
                            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                          >
                            View
                          </button>
                        )}

                        {onUpdateStatus && user.role !== 'admin' && (
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(user, active ? 'inactive' : 'active')}
                            className={`text-xs font-semibold hover:underline ${
                              active ? 'text-red-600' : 'text-emerald-600'
                            }`}
                          >
                            {active ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default UserTable;
