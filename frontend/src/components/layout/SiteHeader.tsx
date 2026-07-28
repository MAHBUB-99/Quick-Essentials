import { NavLink, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState, type FormEvent } from 'react';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Icon } from '@/components/common/Icon';
import { ROUTES } from '@/constants/routes';
import { useCart } from '@/features/cart/CartContext';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

const links = [
  [ROUTES.home, 'Products'],
  [ROUTES.about, 'About'],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { count } = useCart();
  const { resolvedTheme, toggle } = useTheme();
  const activeSearch = searchParams.get('search') ?? '';

  useEffect(() => setSearchInput(activeSearch), [activeSearch]);

  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    const query = searchInput.trim();
    void navigate(query ? `${ROUTES.home}?search=${encodeURIComponent(query)}` : ROUTES.home);
  };

  return (
    <header className="sticky top-0 z-50 isolate overflow-hidden border-b border-emerald-200/70 bg-gradient-to-r from-emerald-50/95 via-white/95 to-lime-50/95 shadow-[0_8px_30px_-16px_rgba(5,150,105,0.45)] backdrop-blur-xl dark:border-emerald-900/60 dark:from-gray-900/95 dark:via-gray-800/95 dark:to-emerald-950/95 dark:shadow-[0_8px_30px_-16px_rgba(0,0,0,0.8)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-10 -top-24 h-44 w-44 rounded-full border border-emerald-500/15 bg-emerald-300/20 dark:border-emerald-400/10 dark:bg-emerald-500/10" />
        <div className="absolute left-[43%] top-2 h-24 w-24 rounded-full bg-lime-300/20 blur-2xl dark:bg-emerald-500/10" />
        <svg
          viewBox="0 0 120 90"
          className="absolute -right-2 -top-3 h-24 w-32 rotate-6 text-emerald-600/[0.12] dark:text-emerald-300/[0.08]"
          fill="none"
        >
          <path d="M28 31H92L86 79H34L28 31Z" stroke="currentColor" strokeWidth="5" />
          <path
            d="M44 33C44 14 52 8 60 8C68 8 76 14 76 33"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M60 48V68" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M59 56C48 56 43 51 43 43C54 43 59 48 59 56Z" fill="currentColor" />
          <path d="M61 51C70 50 75 46 76 39C67 38 62 42 61 51Z" fill="currentColor" />
        </svg>
      </div>

      <nav
        className="relative z-10 mx-auto max-w-[100rem] px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between gap-4">
          <BrandLogo markHref={ROUTES.home} />
          <form
            onSubmit={submitSearch}
            className="hidden h-11 min-w-0 max-w-xl flex-1 items-center overflow-hidden rounded-xl border border-emerald-200/80 bg-white/80 p-1 shadow-sm shadow-emerald-900/5 backdrop-blur-md transition focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/25 dark:border-gray-600 dark:bg-gray-950/75 dark:shadow-black/20 lg:flex"
          >
            <label htmlFor="nav-product-search" className="sr-only">
              Search products
            </label>
            <Icon name="search" className="ml-3 text-gray-400" />
            <input
              id="nav-product-search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="nav-search-input min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 caret-primary-600 outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white"
              placeholder="Search essentials..."
            />
            <button
              type="submit"
              className="ml-1 h-9 min-w-[5.5rem] rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-0"
            >
              Search
            </button>
          </form>

          <div className="hidden items-center gap-1 rounded-xl border border-emerald-100/80 bg-white/50 p-1 shadow-sm backdrop-blur-sm dark:border-gray-700/70 dark:bg-gray-900/50 md:flex">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 text-sm transition hover:bg-emerald-50 hover:text-primary-700 dark:hover:bg-gray-700/80 dark:hover:text-primary-400',
                    isActive
                      ? 'bg-emerald-100 font-semibold text-primary-700 shadow-sm dark:bg-emerald-900/60 dark:text-primary-300'
                      : 'text-gray-700 dark:text-gray-300',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to={ROUTES.cart}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-transparent bg-white/45 text-gray-700 transition hover:border-emerald-200 hover:bg-white hover:text-primary-600 dark:bg-gray-900/40 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
              aria-label={`Shopping cart with ${count} items`}
            >
              <Icon name="cart" className="text-xl" />
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs text-white">
                  {count}
                </span>
              )}
            </Link>
            <Link
              to={ROUTES.login}
              className="hidden items-center gap-2 rounded-xl px-2 py-1 text-gray-700 transition hover:bg-white/80 hover:text-primary-600 dark:text-gray-300 dark:hover:bg-gray-800 sm:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-primary-700 dark:bg-gray-700 dark:text-gray-200">
                <Icon name="user" />
              </span>
              <span>Sign in</span>
            </Link>
            <button
              type="button"
              onClick={toggle}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent bg-white/45 text-gray-700 transition hover:border-emerald-200 hover:bg-white hover:text-primary-600 dark:bg-gray-900/40 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:bg-gray-800"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <span aria-hidden className="text-lg">
                {resolvedTheme === 'dark' ? '☀' : '☾'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/50 text-gray-700 dark:bg-gray-900/50 dark:text-gray-300 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation"
            >
              <Icon name={open ? 'times' : 'bars'} />
            </button>
          </div>
        </div>

        <form
          onSubmit={submitSearch}
          className="mb-3 flex h-11 items-center overflow-hidden rounded-xl border border-emerald-200/80 bg-white/80 p-1 shadow-sm backdrop-blur-md transition focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/25 dark:border-gray-600 dark:bg-gray-950/80 lg:hidden"
        >
          <label htmlFor="mobile-nav-product-search" className="sr-only">
            Search products
          </label>
          <Icon name="search" className="ml-3 text-gray-400" />
          <input
            id="mobile-nav-product-search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            className="nav-search-input min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-gray-900 caret-primary-600 outline-none placeholder:text-gray-400 focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-white"
            placeholder="Search essentials..."
          />
          <button
            type="submit"
            className="ml-1 h-9 min-w-[5.5rem] rounded-lg bg-primary-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 focus-visible:ring-2 focus-visible:ring-primary-300 focus-visible:ring-offset-0"
          >
            Search
          </button>
        </form>

        {open && (
          <div
            id="mobile-navigation"
            className="mb-3 space-y-1 rounded-xl border border-emerald-200/80 bg-white/85 p-2 shadow-lg backdrop-blur-xl dark:border-gray-700 dark:bg-gray-900/90 md:hidden"
          >
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'block rounded-lg px-3 py-2 text-gray-700 hover:bg-primary-50 dark:text-gray-200 dark:hover:bg-gray-700',
                    isActive && 'bg-emerald-100 font-semibold text-primary-700 dark:bg-emerald-900/60',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}
