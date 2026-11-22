
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

const productLinks = [
  { label: 'Labels & Stickers', href: '/products?category=labels-stickers' },
  { label: 'Race & Event Numbers', href: '/products?category=race-numbers' },
  { label: 'MTB Boards', href: '/products?category=mtb-boards' },
  { label: 'Stamps', href: '/products?category=stamps' },
  { label: 'Trophies', href: '/products?category=trophies' },
  { label: 'Laser-cut Work', href: '/products?category=laser-cut' },
];

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const desktopLinkClass = ({ isActive }) =>
  `relative whitespace-nowrap py-2 text-[13px] font-semibold transition-colors duration-200 ${
    isActive
      ? 'text-[#ed793e]'
      : 'text-[#343b36] hover:text-[#ed793e]'
  }`;

export default function Navbar({
  user = null,
  role = 'customer',
  cartCount = 0,
  onLogout,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
    setProductsOpen(false);
  }, [location.pathname, location.search]);

  const closeMenu = () => {
    setMobileOpen(false);
    setProductsOpen(false);
  };

  // Use the Supabase role provided by AuthContext.
  const accountHref =
    role === 'admin'
      ? '/admin/dashboard'
      : '/account/dashboard';

  return (
    <header className="sticky top-0 z-50 border-b border-[#eae6df] bg-white/95 backdrop-blur-xl">
      <div className="container">
        <div className="flex min-h-[72px] items-center justify-between gap-4 lg:gap-6">

          {/* Brand */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex shrink-0 items-center gap-2.5"
            aria-label="Digital Heroes home"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ed793e] text-sm font-black tracking-tight text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
              DH
            </span>

            <span className="flex flex-col leading-tight">
              <span className="text-[12px] font-extrabold tracking-[0.02em] text-[#252c27] sm:text-[13px]">
                DIGITAL HEROES
              </span>

              <span className="mt-1 text-[8px] font-bold tracking-[0.18em] text-[#96958f]">
                PRINT. CREATE. INSPIRE.
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-5 lg:flex 2xl:gap-7"
            aria-label="Main navigation"
          >
            {navLinks.slice(0, 1).map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end
                className={desktopLinkClass}
              >
                {link.label}
              </NavLink>
            ))}

            {/* Desktop Products Dropdown */}
            <div className="group relative">
              <Link
                to="/products"
                className="flex items-center gap-1.5 py-6 text-[13px] font-semibold text-[#343b36] transition-colors hover:text-[#ed793e]"
                aria-haspopup="true"
              >
                Products

                <svg
                  className="h-3 w-3 transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
                  viewBox="0 0 20 20"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="m5 7.5 5 5 5-5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <div className="invisible absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 translate-y-2 rounded-xl border border-[#eee9e1] bg-white p-2 opacity-0 shadow-[0_18px_45px_rgba(35,40,34,0.12)] transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                <div className="px-3 pb-2 pt-2">
                  <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-[#a19d93]">
                    Explore our collection
                  </span>
                </div>

                {productLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-[13px] font-medium text-[#444b44] transition-colors hover:bg-[#f8f2ec] hover:text-[#ed793e]"
                  >
                    {item.label}

                    <span className="text-[#c2bdb3] transition-transform group-hover:translate-x-0.5">
                      →
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {navLinks.slice(1).map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={desktopLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden shrink-0 items-center gap-3 lg:flex">

            {/* Cart */}
            <Link
              to="/cart"
              aria-label={`Shopping cart, ${cartCount} items`}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[#343b36] transition-colors hover:bg-[#f6f3ed] hover:text-[#ed793e]"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[19px] w-[19px]"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 1.9-1.4L21 8H6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="19" r="1.2" fill="currentColor" />
                <circle cx="18" cy="19" r="1.2" fill="currentColor" />
              </svg>

              {cartCount > 0 && (
                <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#ed793e] px-1 text-[9px] font-bold text-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to={accountHref}
                  className="whitespace-nowrap rounded-full border border-[#e9e3da] px-4 py-2.5 text-[12px] font-bold text-[#303831] transition-all hover:border-[#ed793e] hover:text-[#ed793e]"
                >
                  My Account
                </Link>

                {onLogout && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="whitespace-nowrap px-2 py-2 text-[12px] font-semibold text-[#88877f] transition-colors hover:text-red-600"
                  >
                    Logout
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="whitespace-nowrap px-2 py-2 text-[12px] font-bold text-[#303831] transition-colors hover:text-[#ed793e]"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full bg-[#ed793e] px-5 py-2.5 text-[12px] font-bold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#dc6830] hover:shadow-md"
                >
                  Get Started
                  <span className="ml-2 text-sm" aria-hidden="true">
                    →
                  </span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={
              mobileOpen
                ? 'Close navigation menu'
                : 'Open navigation menu'
            }
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#eae6df] text-[#303831] transition-colors hover:bg-[#f8f5ef] lg:hidden"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="m6 6 12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full max-h-[calc(100vh-72px)] overflow-y-auto border-t border-[#eee9e1] bg-white shadow-xl lg:hidden">
          <nav
            className="container flex flex-col py-4"
            aria-label="Mobile navigation"
          >
            {navLinks.slice(0, 1).map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                end
                onClick={closeMenu}
                className={({ isActive }) =>
                  `border-b border-[#f0ece5] py-3.5 text-sm font-semibold ${
                    isActive ? 'text-[#ed793e]' : 'text-[#303831]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {/* Mobile Products */}
            <button
              type="button"
              onClick={() => setProductsOpen((open) => !open)}
              aria-expanded={productsOpen}
              className="flex items-center justify-between border-b border-[#f0ece5] py-3.5 text-left text-sm font-semibold text-[#303831]"
            >
              Products

              <span className="text-lg font-normal text-[#ed793e]">
                {productsOpen ? '−' : '+'}
              </span>
            </button>

            {productsOpen && (
              <div className="my-3 rounded-xl bg-[#f8f5ef] p-2">
                <Link
                  to="/products"
                  onClick={closeMenu}
                  className="block rounded-lg px-3 py-3 text-sm font-bold text-[#ed793e]"
                >
                  View All Products →
                </Link>

                {productLinks.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={closeMenu}
                    className="block rounded-lg px-3 py-2.5 text-sm text-[#50574f] transition-colors hover:bg-white hover:text-[#ed793e]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}

            {navLinks.slice(1).map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `border-b border-[#f0ece5] py-3.5 text-sm font-semibold ${
                    isActive ? 'text-[#ed793e]' : 'text-[#303831]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/cart"
              onClick={closeMenu}
              className="border-b border-[#f0ece5] py-3.5 text-sm font-semibold text-[#303831]"
            >
              Shopping Cart ({cartCount})
            </Link>

            {user ? (
              <>
                <Link
                  to={accountHref}
                  onClick={closeMenu}
                  className="mt-5 flex min-h-12 items-center justify-center rounded-full bg-[#ed793e] px-4 py-3 text-sm font-bold text-white"
                >
                  My Account
                </Link>

                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      onLogout();
                    }}
                    className="mt-3 min-h-12 rounded-full border border-[#e9e3da] px-4 py-3 text-sm font-bold text-[#303831]"
                  >
                    Logout
                  </button>
                )}
              </>
            ) : (
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center justify-center rounded-full border border-[#e9e3da] px-4 py-3 text-sm font-bold text-[#303831]"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="flex min-h-12 items-center justify-center rounded-full bg-[#ed793e] px-4 py-3 text-sm font-bold text-white"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
