
import React from 'react';
import { Link } from 'react-router-dom';

const divisions = [
  {
    number: '01',
    title: 'Labels & Stickers',
    description: 'Make your brand impossible to miss with custom labels and stickers.',
    path: '/products/labels-stickers',
    symbol: '✳',
    background: 'bg-[#f6e8dd]',
    accent: 'text-[#c76c3c]',
  },
  {
    number: '02',
    title: 'Race & Event Numbers',
    description: 'Clear, durable numbers for races, events, and competitions.',
    path: '/products/race-numbers',
    symbol: '08',
    background: 'bg-[#e5e9e2]',
    accent: 'text-[#536b54]',
  },
  {
    number: '03',
    title: 'MTB Boards',
    description: 'Custom number boards built for the spirit of the trail.',
    path: '/products/mtb-boards',
    symbol: '↗',
    background: 'bg-[#e9e4d8]',
    accent: 'text-[#897047]',
  },
  {
    number: '04',
    title: 'Stamps',
    description: 'Professional custom stamps for everyday business needs.',
    path: '/products/stamps',
    symbol: '▦',
    background: 'bg-[#e5e7ed]',
    accent: 'text-[#65718e]',
  },
  {
    number: '05',
    title: 'Trophies',
    description: 'Celebrate achievements with meaningful custom awards.',
    path: '/products/trophies',
    symbol: '♜',
    background: 'bg-[#f3ead7]',
    accent: 'text-[#aa8242]',
  },
  {
    number: '06',
    title: 'Laser-cut Work',
    description: 'Precise cuts and custom shapes for creative projects.',
    path: '/products/laser-cut',
    symbol: '◇',
    background: 'bg-[#e9e3df]',
    accent: 'text-[#8b6250]',
  },
];

export default function DivisionGrid() {
  return (
    <section className="section bg-white">
      <div className="container">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="section-heading mb-0 max-w-2xl">
            <span className="eyebrow">Explore what we create</span>
            <h2>
              One place.
              <br />
              <span className="text-[var(--color-primary)]">
                Six ways to create.
              </span>
            </h2>
            <p>
              Find the right print solution for your brand, your event, or
              your next big idea.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-bold leading-none text-[var(--color-heading)] transition-colors hover:bg-[var(--color-surface-soft)] hover:text-[var(--color-primary)] md:self-end"
          >
            Explore all products
            <span aria-hidden="true">↗</span>
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {divisions.map((division) => (
            <Link
              key={division.path}
              to={division.path}
              className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(32,37,34,0.09)] sm:p-5"
            >
              <div
                className={`relative flex aspect-[1.65/1] w-full shrink-0 items-center justify-center overflow-hidden rounded-xl ${division.background}`}
              >
                <span
                  className={`select-none font-[Manrope] text-7xl font-extrabold tracking-tighter opacity-90 transition-transform duration-500 group-hover:scale-110 sm:text-8xl ${division.accent}`}
                >
                  {division.symbol}
                </span>

                <span className="absolute bottom-3 left-4 text-[9px] font-extrabold tracking-[0.16em] text-[#555a53]/70 sm:bottom-4 sm:text-[10px]">
                  DIGITAL HEROES / {division.number}
                </span>

                <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-[var(--color-heading)] transition-all duration-300 group-hover:rotate-45 group-hover:bg-[var(--color-primary)] group-hover:text-white">
                  ↗
                </span>
              </div>

              <div className="flex flex-1 flex-col pt-4">
                <p className="text-[10px] font-bold tracking-[0.16em] text-[var(--color-muted)]">
                  DIVISION {division.number}
                </p>

                <h3 className="mt-2 text-lg font-bold leading-6 tracking-tight text-[var(--color-heading)]">
                  {division.title}
                </h3>

                <p className="mt-2 min-h-12 text-sm leading-6 text-[var(--color-text)]">
                  {division.description}
                </p>

                <span className="mt-4 inline-flex min-h-8 items-center gap-2 text-xs font-bold leading-none text-[var(--color-primary-dark)] transition-all group-hover:gap-3">
                  Explore division
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
