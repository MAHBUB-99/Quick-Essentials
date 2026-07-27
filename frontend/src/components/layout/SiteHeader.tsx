import { NavLink, Link } from 'react-router-dom';
import { useState } from 'react';
import { Icon } from '@/components/common/Icon';
import { APP_NAME, APP_TAGLINE } from '@/constants/app';
import { ROUTES } from '@/constants/routes';
import { useCart } from '@/features/cart/CartContext';
import { useTheme } from '@/hooks/useTheme';
import { cn } from '@/utils/cn';

const links = [
  [ROUTES.home, 'Home'],
  [ROUTES.products, 'Products'],
  [ROUTES.farmers, 'Farmers'],
  [ROUTES.about, 'About'],
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const { resolvedTheme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg dark:bg-gray-800">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <Link to={ROUTES.home} className="flex items-center gap-3" aria-label="FarmFresh home">
            <span className="rounded-lg bg-primary-500 p-2 text-white">
              <Icon name="seedling" className="text-xl" />
            </span>
            <span>
              <span className="block text-xl font-bold text-gray-900 dark:text-white">
                {APP_NAME}
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-400">{APP_TAGLINE}</span>
            </span>
          </Link>
          <div className="hidden items-center gap-8 md:flex">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'dark:hover:text-primary-400 transition hover:text-primary-600',
                    isActive
                      ? 'dark:text-primary-400 font-medium text-primary-600'
                      : 'text-gray-700 dark:text-gray-300',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to={ROUTES.cart}
              className="relative p-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
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
              className="hidden items-center gap-2 text-gray-700 hover:text-primary-600 dark:text-gray-300 sm:flex"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <Icon name="user" />
              </span>
              <span>Sign in</span>
            </Link>
            <button
              type="button"
              onClick={toggle}
              className="p-2 text-gray-700 hover:text-primary-600 dark:text-gray-300"
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} theme`}
            >
              <span aria-hidden className="text-lg">
                {resolvedTheme === 'dark' ? '☀' : '☾'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="p-2 text-gray-700 dark:text-gray-300 md:hidden"
              aria-expanded={open}
              aria-controls="mobile-navigation"
              aria-label="Toggle navigation"
            >
              <Icon name={open ? 'times' : 'bars'} />
            </button>
          </div>
        </div>
        {open && (
          <div
            id="mobile-navigation"
            className="space-y-1 border-t py-3 dark:border-gray-700 md:hidden"
          >
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-gray-700 hover:bg-primary-50 dark:text-gray-200 dark:hover:bg-gray-700"
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
