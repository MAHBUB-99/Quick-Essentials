import { Outlet, ScrollRestoration } from 'react-router-dom';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';

export function MarketplaceLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-emerald-50 via-green-50/80 to-lime-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <a href="#main-content" className="sr-only z-[100] bg-white p-3 focus:not-sr-only">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main-content" className="flex flex-1 flex-col">
        <Outlet />
      </main>
      <SiteFooter />
      <ScrollRestoration />
    </div>
  );
}
