
import React from 'react';
import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="relative overflow-hidden bg-[#252d28] py-20 sm:py-24">
      <div className="pointer-events-none absolute -right-32 -top-44 h-[520px] w-[520px] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -right-16 -top-28 h-[380px] w-[380px] rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-40 left-[10%] h-80 w-80 rounded-full bg-[var(--color-primary)]/10 blur-3xl" />

      <div className="container relative">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-[10px] font-bold tracking-[0.18em] text-[#f1b18e]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-primary)]" />
            YOUR NEXT IDEA STARTS HERE
          </span>

          <h2 className="mt-7 text-4xl font-extrabold leading-tight tracking-[-0.05em] text-white sm:text-5xl lg:text-6xl">
            Have an idea?
            <br />
            <span className="text-[#f29a6a]">Let's make it real.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-8 text-white/65 sm:text-base">
            Whether you know exactly what you need or you're just getting
            started, we're ready to help you create something worth
            remembering.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex min-h-13 items-center justify-center gap-3 rounded-lg bg-[var(--color-primary)] px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-primary-dark)]"
            >
              Explore Products
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              to="/contact"
              className="inline-flex min-h-13 items-center justify-center gap-3 rounded-lg border border-white/25 bg-white/5 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-[var(--color-heading)]"
            >
              Talk to Our Team
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <p className="mt-8 text-xs text-white/40">
            Custom printing. Thoughtful details. Made around your ideas.
          </p>
        </div>
      </div>
    </section>
  );
}
