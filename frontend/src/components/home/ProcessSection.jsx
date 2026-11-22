
import React from 'react';
import { Link } from 'react-router-dom';

const steps = [
  {
    number: '01',
    title: 'Choose your product',
    description:
      'Explore our print divisions and select the product that suits your project.',
    icon: '▦',
  },
  {
    number: '02',
    title: 'Make it yours',
    description:
      'Choose your size, material, finish, quantity, and upload your artwork or create a design.',
    icon: '✎',
  },
  {
    number: '03',
    title: 'Review your proof',
    description:
      'Check your digital proof, request changes if needed, and approve it for production.',
    icon: '◈',
  },
  {
    number: '04',
    title: 'We make it happen',
    description:
      'Your approved artwork moves into production. Track your order through your account.',
    icon: '✓',
  },
];

export default function ProcessSection() {
  return (
    <section className="bg-[#f2eee7] py-20 sm:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow justify-center">
            Simple from start to finish
          </span>

          <h2 className="mt-4">
            From your idea
            <br />
            to <span className="text-[var(--color-primary)]">the finished print.</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[var(--color-text)] sm:text-base">
            A clear, guided process keeps you in control at every stage.
          </p>
        </div>

        <div className="relative mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          <div className="absolute left-[12%] right-[12%] top-9 hidden border-t border-dashed border-[#cfc4b5] lg:block" />

          {steps.map((step) => (
            <div
              key={step.number}
              className="relative z-10 flex flex-col items-center px-2 text-center"
            >
              <div className="flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-2xl border border-[#ded4c7] bg-white text-3xl text-[var(--color-primary)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                {step.icon}
              </div>

              <p className="mt-5 text-[10px] font-extrabold tracking-[0.18em] text-[var(--color-primary-dark)]">
                STEP {step.number}
              </p>

              <h3 className="mt-2 min-h-[28px] text-lg font-bold leading-7 text-[var(--color-heading)]">
                {step.title}
              </h3>

              <p className="mt-3 min-h-[84px] max-w-xs text-sm leading-7 text-[var(--color-text)]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center sm:mt-14">
          <Link
            to="/products"
            className="inline-flex min-h-[50px] min-w-[180px] items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[var(--color-heading)] px-7 text-sm font-bold leading-none text-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:bg-[#343d37] hover:shadow-lg"
          >
            Start your order
            <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
