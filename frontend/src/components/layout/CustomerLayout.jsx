
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

export default function CustomerLayout({ user = null, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const auth = useAuth();
  const { itemCount = 0 } = useCart();

  const currentUser = user || auth.user;
  const logoutHandler = onLogout || auth.logout;

  const displayName =
    currentUser?.user_metadata?.full_name ||
    currentUser?.user_metadata?.name ||
    currentUser?.name ||
    currentUser?.fullName ||
    'Customer';

  const pageTitles = {
    '/account/dashboard': 'My Dashboard',
    '/account/orders': 'My Orders',
    '/account/proofs': 'Artwork & Proofs',
    '/account/designs': 'Saved Designs',
    '/account/reorder': 'Reorder',
    '/account/profile': 'My Profile',
    '/account/addresses': 'My Addresses',
  };

  const pageTitle =
    pageTitles[location.pathname] || 'Customer Workspace';

  const handleLogout = async () => {
    try {
      await logoutHandler?.();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <Sidebar
        variant="customer"
        user={currentUser}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[var(--color-border)] bg-white/95 px-4 backdrop-blur-xl sm:px-7">

          {/* LEFT SECTION */}
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open customer navigation"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[var(--color-border)] text-[var(--color-heading)] transition hover:bg-[var(--color-surface-soft)] lg:hidden"
            >
              <MenuIcon />
            </button>

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[var(--color-heading)] sm:text-base">
                {pageTitle}
              </p>

              <p className="hidden text-xs text-[var(--color-muted)] sm:block">
                Your personal print workspace
              </p>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-4">

            {/* SHOPPING CART */}
            <Link
              to="/cart"
              aria-label={`Shopping cart, ${itemCount} items`}
              title="Shopping Cart"
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-[var(--color-heading)] transition hover:bg-[var(--color-surface-soft)] hover:text-[#bd6540]"
            >
              <CartIcon />

              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#bd6540] px-1 text-[10px] font-bold text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>

            {/* USER DETAILS */}
            <div className="hidden text-right sm:block">
              <p className="max-w-36 truncate text-xs font-bold text-[var(--color-heading)]">
                {displayName}
              </p>

              <p className="max-w-36 truncate text-[11px] text-[var(--color-muted)]">
                {currentUser?.email || 'Customer account'}
              </p>
            </div>

            {/* LOGOUT */}
            {logoutHandler && (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden rounded-lg border border-[var(--color-border)] px-3 py-2 text-xs font-bold text-[var(--color-text)] transition-colors hover:border-red-300 hover:text-red-600 sm:block"
              >
                Logout
              </button>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="min-w-0 flex-1 p-4 sm:p-7 lg:p-9">
          <div className="mx-auto w-full max-w-[1440px]">
            <Outlet />
          </div>
        </main>

        {/* FOOTER */}
        <footer className="border-t border-[var(--color-border)] bg-white px-5 py-4 text-center text-xs text-[var(--color-muted)]">
          © {new Date().getFullYear()} Digital Heroes. Customer Workspace.
        </footer>
      </div>
    </div>
  );
}
