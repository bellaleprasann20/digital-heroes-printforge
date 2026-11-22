import { useState } from 'react';

const emptyForm = { name: '', slug: '', description: '', isActive: true };

export default function ManageCategories({
  categories = [],
  loading = false,
  error = '',
  onCreate,
  onUpdate,
  onDelete,
  onRetry,
}) {
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const startEdit = (category) => {
    setEditingId(category.id || category._id);
    setForm({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      isActive: category.isActive !== false,
    });
    setFormError('');
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    if (!form.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    const action = editingId ? onUpdate : onCreate;
    if (!action) {
      setFormError('Category service is not connected yet.');
      return;
    }

    setSubmitting(true);
    try {
      await action(editingId ? { id: editingId, ...form } : form);
      resetForm();
    } catch (err) {
      setFormError(err?.message || 'Unable to save category.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    if (!onDelete) return;
    if (!window.confirm(`Delete category "${category.name}"?`)) return;

    try {
      await onDelete(category);
    } catch (err) {
      setFormError(err?.message || 'Unable to delete category.');
    }
  };

  if (loading) return <div className="h-96 animate-pulse rounded-2xl bg-[var(--color-border)]" />;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#bd6540]">Catalogue structure</p>
        <h1 className="mt-2 text-3xl font-bold text-[var(--color-heading)]">Manage categories</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">Organise the product catalogue into clear print divisions.</p>
      </header>

      {(error || formError) && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {formError || error}
          {error && <button onClick={onRetry} className="ml-3 font-bold underline">Retry</button>}
        </div>
      )}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        <section className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
          <div className="border-b border-[var(--color-border)] p-5">
            <h2 className="font-bold text-[var(--color-heading)]">Existing categories</h2>
          </div>

          {categories.length === 0 ? (
            <p className="p-8 text-sm text-[var(--color-muted)]">No categories have been created yet.</p>
          ) : (
            <div className="divide-y divide-[var(--color-border)]">
              {categories.map((category) => (
                <div key={category.id || category._id} className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center">
                  <div>
                    <h3 className="font-semibold text-[var(--color-heading)]">{category.name}</h3>
                    <p className="mt-1 text-xs text-[var(--color-muted)]">/{category.slug || 'no-slug'}</p>
                    {category.description && <p className="mt-2 text-sm text-[var(--color-muted)]">{category.description}</p>}
                    <p className="mt-2 text-xs text-[var(--color-muted)]">
                      {category.productCount ?? 0} products · {category.isActive === false ? 'Inactive' : 'Active'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(category)} className="rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-semibold">Edit</button>
                    <button onClick={() => handleDelete(category)} disabled={!onDelete} className="rounded-lg border border-red-200 px-3 py-2 text-xs font-semibold text-red-600 disabled:opacity-50">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-[var(--color-heading)]">{editingId ? 'Edit category' : 'Add category'}</h2>
            {editingId && <button type="button" onClick={resetForm} className="text-xs font-semibold text-[#b85f39]">Cancel edit</button>}
          </div>

          <label className="block text-sm font-semibold text-[var(--color-heading)]">
            Category name *
            <input value={form.name} onChange={(event) => setForm((old) => ({ ...old, name: event.target.value }))} className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-normal outline-none focus:border-[#c66b43]" required />
          </label>

          <label className="block text-sm font-semibold text-[var(--color-heading)]">
            Slug
            <input value={form.slug} onChange={(event) => setForm((old) => ({ ...old, slug: event.target.value }))} placeholder="e.g. labels-stickers" className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-normal outline-none focus:border-[#c66b43]" />
          </label>

          <label className="block text-sm font-semibold text-[var(--color-heading)]">
            Description
            <textarea rows={4} value={form.description} onChange={(event) => setForm((old) => ({ ...old, description: event.target.value }))} className="mt-2 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-3 font-normal outline-none focus:border-[#c66b43]" />
          </label>

          <label className="flex items-center gap-3 text-sm text-[var(--color-muted)]">
            <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((old) => ({ ...old, isActive: event.target.checked }))} className="h-4 w-4 accent-[#bd6540]" />
            Category is active
          </label>

          <button type="submit" disabled={submitting} className="w-full rounded-xl bg-[#bd6540] px-4 py-3 font-bold text-white disabled:opacity-50">
            {submitting ? 'Saving...' : editingId ? 'Update category' : 'Create category'}
          </button>
        </form>
      </div>
    </div>
  );
}