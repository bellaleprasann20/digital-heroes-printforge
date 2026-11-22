
import React from 'react';
import { Link } from 'react-router-dom';

const values = [
  {
    number: '01',
    title: 'Precision',
    description: 'Clear specifications and production-aware artwork help keep every job aligned with its intended result.',
  },
  {
    number: '02',
    title: 'Customisation',
    description: 'Product options and artwork workflows let customers shape print work around their requirements.',
  },
  {
    number: '03',
    title: 'Visibility',
    description: 'Proof reviews and order tracking give customers a clearer view of what happens after checkout.',
  },
];

const About = () => {
  return (
    <main className="min-h-screen bg-[var(--color-background)]">
      <section className="relative overflow-hidden bg-[var(--color-heading)] text-white">
        <div className="container mx-auto px-4 py-20 sm:px-6 lg:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-300">
            About PrintForge
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            A more considered way to bring print ideas to life.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
            PrintForge brings specialist print products, artwork preparation,
            proof approval, and production tracking into one connected
            experience.
          </p>

          <Link
            to="/products"
            className="mt-9 inline-flex rounded-xl bg-[var(--color-primary)] px-6 py-3.5 text-sm font-bold text-white transition hover:opacity-90"
          >
            Explore our products
          </Link>
        </div>

        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-36 right-20 h-96 w-96 rounded-full border border-white/10" />
      </section>

      <section className="container mx-auto grid gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-24">
        <div>
          <p className="eyebrow">Our approach</p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--color-heading)]">
            From first specification to finished work.
          </h2>
        </div>

        <div className="space-y-5 text-sm leading-7 text-[var(--color-muted)]">
          <p>
            Print projects involve more than choosing a product. Dimensions,
            materials, artwork, proof corrections, and production requirements
            all matter.
          </p>
          <p>
            PrintForge is designed to bring these steps together. Customers can
            explore specialist print divisions, configure products, prepare or
            upload artwork, review proofs, and follow their order through the
            production workflow.
          </p>
          <p>
            The goal is a clearer, more organised experience for customers and
            production teams alike.
          </p>
        </div>
      </section>

      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow">What guides us</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[var(--color-heading)]">
              Built around the details that matter.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.number}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-6"
              >
                <span className="text-sm font-extrabold text-[var(--color-primary)]">
                  {value.number}
                </span>
                <h3 className="mt-5 text-xl font-bold text-[var(--color-heading)]">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)]">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 text-center sm:px-6 lg:py-20">
        <p className="eyebrow">Let's make something</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-extrabold text-[var(--color-heading)]">
          Have a print project in mind?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-muted)]">
          Explore the product range or get in touch to discuss your
          requirements.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link
            to="/products"
            className="rounded-xl bg-[var(--color-primary)] px-6 py-3 font-bold text-white hover:bg-[var(--color-primary-dark)]"
          >
            Browse products
          </Link>
          <Link
            to="/contact"
            className="rounded-xl border border-[var(--color-border)] px-6 py-3 font-bold text-[var(--color-heading)] hover:bg-[var(--color-surface-soft)]"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
};

export default About;
