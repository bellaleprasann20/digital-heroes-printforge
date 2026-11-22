import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

export default function ManageProducts({
  products = [],
  categories = [],
  loading = false,
  error = '',
  onDelete,
  onToggleStatus,
  onRetry,
}) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [busyId, setBusyId] = useState(null);

  const filtered = useMemo(() => products.filter((product) => {
    const query = search.trim().toLowerCase();
    const matchesSearch =
      !query ||
      [product.name, product.sku, product.categoryName]
        .some((value) => String(value || '').toLowerCase().includes(query));

    const productCategory = product.categoryId || product.category?.id || product.category;
    return matchesSearch && (category === 'all' || String(productCategory) === category);
  }), [products, search, category]);

  const handleAction = async (product, action, confirmMessage) => {
    if (!action) return;
    if (confirmMessage && !window.confirm(confirmMessage)) return;

    const id = product.id || product._id;
    setBusyId(id);

    try {
      await action(product);
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
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">Catalogue</p>
          <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Manage products</h1>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Maintain products, pricing, availability, and catalogue details.</p>
        </div>
        <Link to="/admin/products/new" className="rounded-xl bg-[#bd6540] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#a95432]">
          + Add product
        </Link>
      </header>

      <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
        <div className="grid gap-3 md:grid-cols-[1fr_240px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product name or SKU..."
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 text-sm outline-none focus:border-[#c66b43]"
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-3 text-sm">
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option key={item.id || item._id} value={String(item.id || item._id)}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-3 text-xs text-[var(--color-muted)]">{filtered.length} products</p>
      </section>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-12 text-center">
          <p className="font-semibold text-[var(--color-heading)]">No products found</p>
          <p className="mt-2 text-sm text-[var(--color-muted)]">Try changing your search or category filter.</p>
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-[var(--color-background)] text-xs text-[var(--color-muted)]">
                <tr>
                  <th className="px-5 py-4">Product</th>
                  <th className="px-5 py-4">Category</th>
                  <th className="px-5 py-4">Starting price</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((product) => {
                  const id = product.id || product._id;
                  const active = product.isActive !== false && product.status !== 'inactive';

                  return (
                    <tr key={id} className="border-t border-[var(--color-border)]">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.imageUrl || product.image ? (
                            <img src={product.imageUrl || product.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                          ) : (
                            <div className="grid h-12 w-12 place-items-center rounded-lg bg-[var(--color-background)] text-xl">▧</div>
                          )}
                          <div>
                            <p className="font-semibold text-[var(--color-heading)]">{product.name}</p>
                            <p className="mt-1 text-xs text-[var(--color-muted)]">{product.sku || 'No SKU'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-[var(--color-muted)]">{product.categoryName || product.category?.name || '—'}</td>
                      <td className="px-5 py-4 font-semibold text-[var(--color-heading)]">
                        {product.startingPrice != null || product.price != null
                          ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: product.currency || 'INR' }).format(Number(product.startingPrice ?? product.price))
                          : '—'}
                      </td>
                      <td className="px-5 py-4">
                        <span className="rounded-full bg-[var(--color-background)] px-3 py-1 text-xs font-semibold capitalize text-[var(--color-muted)]">
                          {active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/products/${id}/edit`} className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold">Edit</Link>
                          <button
                            disabled={!onToggleStatus || busyId === id}
                            onClick={() => handleAction(product, onToggleStatus)}
                            className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold disabled:opacity-50"
                          >
                            {active ? 'Disable' : 'Enable'}
                          </button>
                          <button
                            disabled={!onDelete || busyId === id}
                            onClick={() => handleAction(product, onDelete, `Delete ${product.name}?`)}
                            className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}