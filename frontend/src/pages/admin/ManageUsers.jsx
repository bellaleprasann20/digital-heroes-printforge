import { useMemo, useState } from 'react';

export default function ManageUsers({
  users = [],
  loading = false,
  error = '',
  onUpdateStatus,
  onUpdateRole,
  onView,
  onRetry,
}) {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const query = search.toLowerCase().trim();
    const matchesSearch =
      !query ||
      [user.name, user.fullName, user.email, user.phone]
        .some((value) => String(value || '').toLowerCase().includes(query));

    const role = String(user.role || 'customer').toLowerCase();
    const status = String(user.status || (user.isActive === false ? 'inactive' : 'active')).toLowerCase();

    return matchesSearch &&
      (roleFilter === 'all' || role === roleFilter) &&
      (statusFilter === 'all' || status === statusFilter);
  }), [users, search, roleFilter, statusFilter]);

  const runAction = async (user, action) => {
    const id = user.id || user._id;
    if (!id || !action) return;
    setBusyId(id);
    try {
      await action(user);
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />;

  if (error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-semibold text-red-800">{error}</p>
        <button onClick={onRetry} className="mt-3 text-sm font-bold text-red-800 underline">Try again</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">Administration</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Manage users</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Review customer accounts and manage access.</p>
      </header>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search name, email or phone..."
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]"
          />
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 text-sm">
            <option value="all">All roles</option>
            <option value="customer">Customer</option>
            <option value="administrator">Administrator</option>
            <option value="admin">Admin</option>
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 text-sm">
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">{filteredUsers.length} user records</p>
      </section>

      <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
        {filteredUsers.length === 0 ? (
          <p className="p-10 text-center text-sm text-[var(--color-muted)]">No users match your filters.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[var(--color-background)] text-xs text-[var(--color-muted)]">
                <tr>
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Joined</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => {
                  const id = user.id || user._id;
                  const status = user.status || (user.isActive === false ? 'inactive' : 'active');

                  return (
                    <tr key={id} className="border-t border-[var(--color-border)]">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[var(--color-heading)]">{user.name || user.fullName || 'Unnamed user'}</p>
                        <p className="mt-1 text-xs text-[var(--color-muted)]">{user.email}</p>
                      </td>
                      <td className="px-5 py-4 capitalize text-[var(--color-muted)]">{user.role || 'customer'}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[var(--color-background)] px-3 py-1 text-xs font-semibold capitalize text-[var(--color-muted)]">{status}</span>
                      </td>
                      <td className="px-5 py-4 text-[var(--color-muted)]">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN') : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => onView?.(user)} className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold">View</button>
                          <button
                            disabled={!onUpdateStatus || busyId === id}
                            onClick={() => runAction(user, onUpdateStatus)}
                            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold disabled:opacity-50"
                          >
                            {busyId === id ? 'Updating...' : status === 'active' ? 'Deactivate' : 'Activate'}
                          </button>
                          {onUpdateRole && (
                            <button
                              disabled={busyId === id}
                              onClick={() => runAction(user, onUpdateRole)}
                              className="rounded-lg bg-[#bd6540] px-3 py-2 text-xs font-bold text-white disabled:opacity-50"
                            >
                              Change role
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
    </div>
  );
}