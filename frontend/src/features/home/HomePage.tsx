import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/cards/ProductCard';
import { Icon } from '@/components/common/Icon';
import { PageLoader } from '@/components/feedback/PageState';
import { getProducts } from '@/services/api/marketplace';
import type { CategorySlug, ProductSort } from '@/types';
import { readNotifications } from '@/features/dashboard/notifications';
import { readCategories } from '@/features/dashboard/categories';
import type { IconName } from '@/lib/icons';

const CATEGORY_STYLES: Record<string, { icon: IconName; color: string }> = {
  vegetables: { icon: 'carrot', color: 'bg-green-100 text-green-600 dark:bg-green-900' },
  fruits: { icon: 'appleAlt', color: 'bg-red-100 text-red-600 dark:bg-red-900' },
  grains: { icon: 'seedling', color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900' },
  dairy: { icon: 'cheese', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900' },
  herbs: { icon: 'leaf', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900' },
  honey: { icon: 'jar', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900' },
};

const FALLBACK_CATEGORY_STYLE = {
  icon: 'leaf' as const,
  color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900',
};

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search')?.trim() ?? '';
  const [selectedCategories, setSelectedCategories] = useState<CategorySlug[]>([]);
  const [organicOnly, setOrganicOnly] = useState(false);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [sort, setSort] = useState<ProductSort>('rating');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [notifications] = useState(readNotifications);
  const [adminCategories] = useState(readCategories);
  const enabledNotifications = notifications.filter((notification) => notification.enabled);
  const categories = adminCategories.map((category) => {
    const style = CATEGORY_STYLES[category.slug] ?? FALLBACK_CATEGORY_STYLE;
    return [style.icon, category.name, category.slug as CategorySlug, '', style.color] as const;
  });
  const products = useQuery({
    queryKey: [
      'products',
      'catalog',
      search,
      selectedCategories,
      organicOnly,
      priceMin,
      priceMax,
      sort,
    ],
    queryFn: () =>
      getProducts({
        search,
        categories: selectedCategories,
        organicOnly,
        priceMin: priceMin === '' ? undefined : Number(priceMin),
        priceMax: priceMax === '' ? undefined : Number(priceMax),
        sort,
      }),
  });
  const toggleCategory = (category: CategorySlug) =>
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  const hasFilters =
    Boolean(search) ||
    selectedCategories.length > 0 ||
    organicOnly ||
    priceMin !== '' ||
    priceMax !== '' ||
    sort !== 'rating';
  const hasAppliedFilters =
    Boolean(search) ||
    selectedCategories.length > 0 ||
    organicOnly ||
    priceMin !== '' ||
    priceMax !== '';
  const activeFilterCount =
    selectedCategories.length +
    Number(organicOnly) +
    Number(priceMin !== '') +
    Number(priceMax !== '');
  const resetFilters = () => {
    setSearchParams({});
    setSelectedCategories([]);
    setOrganicOnly(false);
    setPriceMin('');
    setPriceMax('');
    setSort('rating');
  };

  useEffect(() => {
    if (!filtersOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setFiltersOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [filtersOpen]);
  const productsToDisplay =
    !search &&
    selectedCategories.length === 0 &&
    !organicOnly &&
    priceMin === '' &&
    priceMax === '' &&
    products.data?.length &&
    products.data.length < 12
      ? Array.from(
          { length: 12 },
          (_, index) => products.data[Math.floor(index / 2) % products.data.length]!,
        )
      : (products.data ?? []);

  return (
    <div className="relative isolate flex-1 overflow-hidden bg-gradient-to-br from-emerald-200/70 via-emerald-50 to-lime-200/65 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/80">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-28 h-96 w-96 rounded-full bg-emerald-300/50 blur-3xl dark:bg-emerald-600/10" />
        <div className="absolute -right-28 top-[38%] h-[30rem] w-[30rem] rounded-full bg-lime-300/50 blur-3xl dark:bg-primary-700/15" />
        <div
          className="absolute inset-0 opacity-[0.085] dark:opacity-[0.055]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #16a34a 1px, transparent 1px), linear-gradient(to bottom, #16a34a 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
        <svg
          viewBox="0 0 220 260"
          className="absolute -left-12 top-[28rem] w-56 -rotate-6 text-emerald-700/[0.23] sm:w-72 dark:text-emerald-400/[0.07]"
          fill="none"
        >
          <path d="M108 258C106 184 111 116 137 42" stroke="currentColor" strokeWidth="8" />
          <path d="M130 72C76 72 47 45 48 3C100 2 132 27 130 72Z" fill="currentColor" />
          <path d="M116 127C62 126 30 100 28 57C82 55 115 80 116 127Z" fill="currentColor" />
          <path d="M124 105C176 102 207 76 211 35C160 31 127 56 124 105Z" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 180 180"
          className="absolute -right-10 top-28 w-44 rotate-12 text-emerald-700/[0.23] sm:right-8 sm:w-56 dark:text-emerald-400/[0.07]"
          fill="none"
        >
          <path d="M42 60H138L128 153H52L42 60Z" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
          <path d="M65 64C65 33 79 20 90 20C101 20 115 33 115 64" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
          <path d="M90 88V128" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path d="M90 104C71 103 62 94 63 80C81 79 91 87 90 104Z" fill="currentColor" />
          <path d="M91 96C105 95 114 88 116 76C102 74 93 81 91 96Z" fill="currentColor" />
        </svg>
      </div>
      <div className="relative z-10">
      <div
        className="flex overflow-hidden border-y border-primary-700/40 bg-gradient-to-r from-gray-950 via-emerald-950 to-gray-950 text-emerald-50 shadow-sm"
        role="region"
        aria-label="Current offers and notices"
      >
        <span className="sr-only">{enabledNotifications.map((item) => item.message).join('. ')}</span>
        <div className="min-w-0 flex-1 overflow-hidden py-1.5">
          <div className="offer-ticker-track flex w-max items-center" aria-hidden="true">
            {[0, 1].map((group) => (
              <div key={group} className="flex shrink-0 items-center">
                {enabledNotifications.map((notification) => (
                  <span
                    key={`${group}-${notification.id}`}
                    className="flex items-center gap-2 px-7 text-xs font-semibold sm:text-sm"
                  >
                    <Icon name={notification.icon} className="text-primary-400" />
                    {notification.message}
                    <span className="ml-5 text-primary-500">●</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 border-l border-primary-700/50 bg-gray-950 px-2 shadow-[-10px_0_20px_rgba(3,7,18,0.35)] sm:px-3">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="relative flex h-8 items-center gap-2 rounded-lg border border-primary-700/60 bg-emerald-950 px-2.5 text-xs font-semibold text-white transition hover:border-primary-500 hover:bg-primary-900 focus-visible:ring-1 focus-visible:ring-primary-500 sm:px-3 sm:text-sm lg:hidden"
            aria-label={`Open filters${activeFilterCount ? `, ${activeFilterCount} active` : ''}`}
            aria-haspopup="dialog"
          >
            <Icon name="bars" className="text-primary-400" />
            <span className="hidden sm:inline">Filters</span>
            {activeFilterCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-500 px-1 text-[10px] text-white">
                {activeFilterCount}
              </span>
            )}
          </button>
          {hasAppliedFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex h-8 items-center gap-1.5 rounded-lg border border-gray-700 bg-gray-900 px-2.5 text-xs font-semibold text-gray-200 transition hover:border-red-500/70 hover:bg-red-950/60 hover:text-red-200 focus-visible:ring-1 focus-visible:ring-red-500 sm:px-3 lg:hidden"
              aria-label="Clear all filters and sorting"
            >
              <Icon name="times" className="text-[11px]" />
              <span>Clear</span>
            </button>
          )}
          <span className="relative">
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as ProductSort)}
              aria-label="Sort products"
              className="h-8 appearance-none rounded-lg border border-primary-700/60 bg-emerald-950 py-0 pl-3 pr-10 text-xs font-semibold text-white shadow-inner outline-none hover:border-primary-500 focus:border-primary-400 focus-visible:ring-1 focus-visible:ring-primary-500 focus-visible:ring-offset-0 sm:min-w-36 sm:text-sm"
            >
              <option value="rating">Top Rated</option>
              <option value="price-asc">Low to High</option>
              <option value="price-desc">High to Low</option>
            </select>
            <Icon
              name="chevronDown"
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-emerald-100"
              aria-hidden
            />
          </span>
        </div>
      </div>
      <section className="bg-white/20 pb-16 pt-4 dark:bg-gray-900/45 dark:backdrop-blur-[1px]">
        <div className="mx-auto grid max-w-[100rem] items-start gap-4 px-3 sm:px-5 lg:grid-cols-[13.5rem_minmax(0,1fr)] lg:px-7">
          <aside className="sticky top-2 hidden overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/85 shadow-lg shadow-emerald-950/5 backdrop-blur-md dark:border-emerald-900/60 dark:bg-gray-900/85 lg:block">
            <div className="flex items-center justify-between border-b border-emerald-100 px-4 py-3 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                  <Icon name="filter" className="text-xs" />
                </span>
                <h2 className="text-sm font-bold">Filters</h2>
              </div>
              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <span className="rounded-full bg-primary-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    {activeFilterCount}
                  </span>
                )}
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[11px] font-semibold text-primary-600 transition hover:text-primary-700 dark:text-primary-400"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="p-3.5">
            <fieldset>
              <legend className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-500">Categories</legend>
              <div className="space-y-1.5">
                {categories.map(([icon, title, slug, , color]) => (
                  <label
                    key={slug}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border px-2 py-1.5 text-xs font-semibold transition ${
                      selectedCategories.includes(slug)
                        ? 'border-primary-500 bg-primary-50 text-primary-800 dark:bg-primary-950/70 dark:text-primary-200'
                        : 'border-transparent hover:border-emerald-200 hover:bg-emerald-50/70 dark:hover:border-gray-700 dark:hover:bg-gray-800'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(slug)}
                      onChange={() => toggleCategory(slug)}
                      className="sr-only"
                    />
                    <span className={`flex h-7 w-7 items-center justify-center rounded-md ${color}`}>
                      <Icon name={icon} />
                    </span>
                    {title}
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-4 border-t border-gray-200 pt-3.5 dark:border-gray-700">
              <legend className="text-xs font-bold uppercase tracking-wide text-gray-500">Price range</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="text-xs text-gray-500">
                  Min
                  <input
                    type="number"
                    min="0"
                    value={priceMin}
                    onChange={(event) => setPriceMin(event.target.value)}
                    placeholder="৳0"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </label>
                <label className="text-xs text-gray-500">
                  Max
                  <input
                    type="number"
                    min="0"
                    value={priceMax}
                    onChange={(event) => setPriceMax(event.target.value)}
                    placeholder="৳500"
                    className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  />
                </label>
              </div>
            </fieldset>

            <label className="mt-4 flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-2.5 text-xs dark:border-gray-700">
              <span>
                <span className="block font-semibold">Organic only</span>
                <span className="mt-0.5 block text-[10px] text-gray-500">Certified organic products</span>
              </span>
              <input
                type="checkbox"
                checked={organicOnly}
                onChange={(event) => setOrganicOnly(event.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </label>
            </div>
          </aside>

          <div className="min-w-0">
            {products.isLoading ? (
              <PageLoader />
            ) : productsToDisplay.length ? (
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {productsToDisplay.map((product, index) => (
                  <ProductCard key={`${product.id}-${index}`} product={product} compact />
                ))}
              </div>
            ) : (
              <div className="relative isolate flex min-h-[24rem] items-center justify-center overflow-hidden rounded-3xl border border-emerald-700/40 bg-gradient-to-br from-gray-900 via-emerald-950 to-gray-950 px-6 py-12 text-center shadow-xl shadow-emerald-950/20">
                <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                  <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-500/15 blur-3xl" />
                  <div className="absolute -bottom-28 -right-16 h-80 w-80 rounded-full bg-lime-500/10 blur-3xl" />
                  <div
                    className="absolute inset-0 opacity-[0.055]"
                    style={{
                      backgroundImage:
                        'linear-gradient(to right, #34d399 1px, transparent 1px), linear-gradient(to bottom, #34d399 1px, transparent 1px)',
                      backgroundSize: '38px 38px',
                    }}
                  />
                  <svg
                    viewBox="0 0 230 270"
                    className="absolute -bottom-14 -left-10 w-52 -rotate-6 text-emerald-400/[0.16] sm:w-64"
                    fill="none"
                  >
                    <path d="M112 270C110 194 116 122 143 44" stroke="currentColor" strokeWidth="8" />
                    <path d="M136 78C82 78 52 51 53 9C105 8 138 34 136 78Z" fill="currentColor" />
                    <path d="M121 137C66 136 34 109 32 66C86 64 120 90 121 137Z" fill="currentColor" />
                    <path d="M130 112C182 109 213 83 217 42C166 38 133 64 130 112Z" fill="currentColor" />
                  </svg>
                  <svg
                    viewBox="0 0 220 190"
                    className="absolute -bottom-8 -right-8 w-52 rotate-6 text-lime-300/[0.12] sm:w-64"
                    fill="none"
                  >
                    <path d="M35 71H185L169 168H51L35 71Z" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" />
                    <path d="M67 74C67 35 86 18 110 18C134 18 153 35 153 74" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    <path d="M77 102H143M70 130H150" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </svg>
                  <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/10" />
                  <div className="absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/10" />
                </div>

                <div className="relative z-10 max-w-md">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/30 bg-emerald-900/70 text-3xl text-emerald-300 shadow-lg shadow-emerald-950/40 backdrop-blur">
                    <Icon name="boxOpen" />
                  </span>
                  <h2 className="mt-5 text-2xl font-bold text-white">No products found</h2>
                  <p className="mt-2 text-sm leading-6 text-emerald-100/70 sm:text-base">
                    We couldn’t find anything matching these filters. Try a broader selection to
                    discover more fresh products.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-950/30 transition hover:-translate-y-0.5 hover:bg-primary-600"
                  >
                    <Icon name="redo" /> Reset filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      {filtersOpen && (
        <div
          className="fixed inset-0 z-[70] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-labelledby="filters-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-gray-950/65 backdrop-blur-[2px]"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(90vw,23rem)] flex-col border-r border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-700">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-600">
                  Refine products
                </p>
                <h2 id="filters-title" className="mt-0.5 text-xl font-bold">
                  Filters
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {hasFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 dark:text-primary-400 dark:hover:bg-gray-800"
                  >
                    Reset
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label="Close filters"
                >
                  <Icon name="times" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold">Categories</legend>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(([icon, title, slug, , color]) => {
                    const checked = selectedCategories.includes(slug);
                    return (
                      <label
                        key={slug}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border p-2.5 text-sm transition ${
                          checked
                            ? 'border-primary-500 bg-primary-50 text-primary-800 dark:bg-primary-900/50 dark:text-white'
                            : 'border-gray-200 hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCategory(slug)}
                          className="sr-only"
                        />
                        <span
                          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${color}`}
                        >
                          <Icon name={icon} />
                        </span>
                        <span className="font-medium">{title}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="mt-6 border-t border-gray-200 pt-5 dark:border-gray-700">
                <legend className="text-sm font-semibold">Price range</legend>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <label className="text-xs text-gray-500">
                    Minimum
                    <input
                      type="number"
                      min="0"
                      value={priceMin}
                      onChange={(event) => setPriceMin(event.target.value)}
                      placeholder="৳0"
                      className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </label>
                  <label className="text-xs text-gray-500">
                    Maximum
                    <input
                      type="number"
                      min="0"
                      value={priceMax}
                      onChange={(event) => setPriceMax(event.target.value)}
                      placeholder="৳500"
                      className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                    />
                  </label>
                </div>
              </fieldset>

              <label className="mt-6 flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 p-3.5 dark:border-gray-700">
                <span>
                  <span className="block text-sm font-semibold">Organic only</span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    Show organic products only
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={organicOnly}
                  onChange={(event) => setOrganicOnly(event.target.checked)}
                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </label>
            </div>

            <div className="border-t border-gray-200 p-4 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="w-full rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-700"
              >
                Show {productsToDisplay.length} products
              </button>
            </div>
          </aside>
        </div>
      )}
      </div>
    </div>
  );
}
