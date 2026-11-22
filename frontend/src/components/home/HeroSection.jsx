
import React from 'react';
import { Link } from 'react-router-dom';

const highlights = [
  { value: '06', label: 'Specialist print divisions' },
  { value: '100%', label: 'Made around your needs' },
  { value: '01', label: 'Simple online ordering' },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#f4f0e9]">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full border border-[#dfd5c8] opacity-60" />
      <div className="pointer-events-none absolute -right-20 -top-20 h-[400px] w-[400px] rounded-full border border-[#dfd5c8] opacity-60" />

      <div className="container relative grid items-center gap-16 py-16 lg:min-h-[650px] lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-20">
        <div className="relative z-10 max-w-2xl animate-fade-in">
          <span className="eyebrow">
            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
            Your ideas, beautifully printed
          </span>

          <h1 className="mt-5 max-w-[680px] text-[clamp(3rem,6vw,5.4rem)] font-extrabold leading-[1.04] tracking-[-0.065em]">
            Make your mark.
            <br />
            <span className="text-[var(--color-primary)]">Print it</span> your way.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-[#626963] sm:text-lg">
            From standout stickers to custom trophies, discover print products
            made for your ideas, your events, and your business.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-lg bg-[var(--color-primary)] px-7 text-sm font-bold leading-none text-white shadow-lg shadow-orange-900/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--color-primary-dark)]"
            >
              Explore Products
              <span aria-hidden="true">↗</span>
            </Link>

            <Link
              to="/gallery"
              className="inline-flex min-h-[52px] shrink-0 items-center justify-center gap-3 whitespace-nowrap rounded-lg border border-[#d8d1c7] bg-white/70 px-7 text-sm font-bold leading-none text-[var(--color-heading)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-heading)] hover:bg-white"
            >
              View Our Work
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-[#ded7cc] pt-7">
            {highlights.map((item) => (
              <div key={item.label} className="min-w-0">
                <p className="font-[Manrope] text-2xl font-extrabold tracking-tight text-[var(--color-heading)] sm:text-3xl">
                  {item.value}
                </p>
                <p className="mt-2 max-w-28 text-[11px] leading-5 text-[#777b74] sm:text-xs">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[570px] animate-fade-in lg:mb-5">
          <div className="absolute -right-3 top-8 h-[85%] w-[85%] rounded-[2rem] bg-[#e7d9c8] sm:-right-7" />

          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/70 bg-[#ded4c5] p-3 shadow-[0_30px_80px_rgba(49,42,31,0.16)] sm:p-5">
            <div className="relative flex min-h-[410px] flex-col justify-between overflow-hidden rounded-[1.3rem] bg-[#e9e1d5] p-6 sm:min-h-[490px] sm:p-9">
              <div className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#d7c4ae] opacity-70 blur-2xl" />
              <div className="absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-[#f5a477] opacity-30 blur-3xl" />

              <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="text-[9px] font-extrabold tracking-[0.2em] text-[#6e685e] sm:text-[10px]">
                  THE PRINT COLLECTION
                </span>
                <span className="shrink-0 rounded-full border border-[#c9bdad] px-3 py-1.5 text-[9px] font-bold text-[#6e685e] sm:text-[10px]">
                  EST. FOR IDEAS
                </span>
              </div>

              <div className="relative z-10 mx-auto flex w-full max-w-[380px] flex-1 items-center justify-center py-7">
                <div className="relative h-[285px] w-full">
                  <div className="absolute left-[8%] top-[16%] h-48 w-36 -rotate-[13deg] rounded-lg bg-white p-3 shadow-xl">
                    <div className="flex h-full flex-col items-center justify-center rounded-md border border-dashed border-[#e5d9cc] bg-[#f7f3ed]">
                      <span className="text-4xl font-black tracking-tighter text-[var(--color-primary)]">
                        DH
                      </span>
                      <span className="mt-2 text-[8px] font-bold tracking-[0.2em] text-[#77736b]">
                        STICKERS
                      </span>
                    </div>
                  </div>

                  <div className="absolute right-[7%] top-[5%] flex h-40 w-40 rotate-[10deg] items-center justify-center rounded-full border-[12px] border-[#e87535] bg-[#fff9f0] shadow-xl">
                    <div className="flex h-28 w-28 items-center justify-center rounded-full border border-dashed border-[#e87535]">
                      <span className="text-center text-xs font-black leading-4 tracking-widest text-[#343b35]">
                        MADE
                        <br />
                        TO
                        <br />
                        STAND OUT
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-[3%] left-[23%] flex h-32 w-52 -rotate-[5deg] flex-col justify-between rounded-xl bg-[#28342f] p-4 shadow-2xl">
                    <span className="text-[9px] font-bold tracking-[0.2em] text-white/60">
                      DIGITAL HEROES
                    </span>
                    <span className="font-[Manrope] text-3xl font-extrabold leading-none tracking-tight text-white">
                      CREATE
                      <br />
                      MORE.
                    </span>
                    <span className="text-[8px] font-semibold tracking-[0.18em] text-[#f3a477]">
                      PRINT YOUR IDEAS
                    </span>
                  </div>

                  <div className="absolute bottom-[4%] right-[1%] h-16 w-16 rotate-[17deg] rounded-lg border-4 border-white bg-[#f1b84e] shadow-lg" />
                </div>
              </div>

              <div className="relative z-10 flex items-end justify-between gap-4 border-t border-[#cfc4b5] pt-4">
                <div>
                  <p className="text-xs font-bold text-[#373c36]">
                    Ideas into reality.
                  </p>
                  <p className="mt-1 text-[10px] text-[#77736b]">
                    One custom print at a time.
                  </p>
                </div>
                <span className="text-2xl font-black tracking-tighter text-[#343b35]">
                  DH.
                </span>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-10 left-4 z-20 rounded-xl border border-white/80 bg-white px-4 py-3 shadow-xl sm:-left-8">
            <p className="text-[10px] font-bold tracking-wider text-[var(--color-muted)]">
              MADE FOR YOUR IDEAS
            </p>
            <p className="mt-1 whitespace-nowrap text-sm font-extrabold text-[var(--color-heading)]">
              Designed to stand out.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
