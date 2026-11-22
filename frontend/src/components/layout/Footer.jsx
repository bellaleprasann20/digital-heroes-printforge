
import React from 'react';
import { Link } from 'react-router-dom';

const divisions = [
  ['Labels & Stickers', '/products/labels-stickers'],
  ['Race & Event Numbers', '/products/race-numbers'],
  ['MTB Boards', '/products/mtb-boards'],
  ['Stamps', '/products/stamps'],
  ['Trophies', '/products/trophies'],
  ['Laser-cut Work', '/products/laser-cut'],
];

const companyLinks = [
  ['About Us', '/about'],
  ['Gallery', '/gallery'],
  ['Contact', '/contact'],
  ['My Account', '/account/dashboard'],
];

const socialLinks = [
  {
    label: 'Instagram',
    text: 'IG',
    href: 'https://www.instagram.com/',
  },
  {
    label: 'Facebook',
    text: 'f',
    href: 'https://www.facebook.com/',
  },
  {
    label: 'LinkedIn',
    text: 'in',
    href: 'https://www.linkedin.com/',
  },
];

const linkClass =
  'text-sm text-white/55 transition-colors duration-200 hover:text-[#f47a3c]';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#202722] text-white">
      {/* Subtle brand accent */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ef793d]/70 to-transparent" />

      <div className="container relative py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-11 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.85fr_0.75fr_1.15fr] lg:gap-12">

          {/* Brand */}
          <div>
            <Link
              to="/"
              className="group inline-flex items-center gap-3"
              aria-label="Digital Heroes home"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f0783b] text-sm font-black tracking-tight text-white shadow-lg shadow-black/10 transition-transform duration-300 group-hover:scale-105">
                DH
              </span>

              <span className="flex flex-col">
                <span className="text-sm font-extrabold tracking-wide text-white">
                  DIGITAL HEROES
                </span>
                <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-white/45">
                  Print. Create. Inspire.
                </span>
              </span>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-7 text-white/55">
              Thoughtful print. Professional finishing. Custom products made
              to bring your ideas to life.
            </p>

            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-xs font-bold text-white/75 transition-all duration-200 hover:-translate-y-1 hover:border-[#f0783b] hover:bg-[#f0783b] hover:text-white"
                >
                  {social.text}
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Our Products
            </h3>

            <ul className="mt-6 space-y-3.5">
              {divisions.map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-white">
              Explore
            </h3>

            <ul className="mt-6 space-y-3.5">
              {companyLinks.map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className={linkClass}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#f0783b]">
              Have a project in mind?
            </span>

            <h3 className="mt-3 text-xl font-bold leading-snug tracking-tight text-white sm:text-2xl">
              Let's create
              <span className="block text-[#f0783b]">
                something great.
              </span>
            </h3>

            <p className="mt-4 max-w-sm text-sm leading-7 text-white/55">
              Have a custom print requirement? Tell us about your idea and
              let's bring it to life.
            </p>

            <Link
              to="/contact"
              className="mt-6 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#f0783b] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-1 hover:bg-[#df6730] hover:shadow-xl"
            >
              Contact Our Team
              <span aria-hidden="true" className="text-lg leading-none">
                →
              </span>
            </Link>

            <p className="mt-4 text-xs leading-5 text-white/35">
              Business contact details will be added before launch.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-white/40">
            © {new Date().getFullYear()} Digital Heroes. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link
              to="/privacy"
              className="text-xs text-white/45 transition-colors hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              to="/terms"
              className="text-xs text-white/45 transition-colors hover:text-white"
            >
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
