
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[var(--color-background)] px-4 py-16">
      <section className="w-full max-w-xl text-center">
        <div className="relative mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[var(--color-surface-soft)]">
          <span className="text-6xl font-black tracking-tighter text-[var(--color-primary)]">
            404
          </span>
          <span className="absolute -right-1 -top-1 h-7 w-7 rounded-full border-4 border-[var(--color-background)] bg-[var(--color-primary)]" />
        </div>

        <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Page not found
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--color-heading)] sm:text-4xl">
          This page missed the print run.
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--color-muted)]">
          The page you're looking for may have moved, been removed, or never
          existed. Let's get you back to the right place.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-[var(--color-primary)] px-6 py-3 text-sm font-bold text-white transition hover:bg-[var(--color-primary-dark)]"
          >
            Back to homepage
          </Link>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-[var(--color-border)] px-6 py-3 text-sm font-bold text-[var(--color-heading)] transition hover:bg-[var(--color-surface-soft)]"
          >
            Go back
          </button>
        </div>
      </section>
    </main>
  );
};

export default NotFound;
