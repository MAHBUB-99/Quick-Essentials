import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { ProductCard } from '@/components/cards/ProductCard';
import { EmptyState, PageLoader } from '@/components/feedback/PageState';
import { getProducts } from '@/services/api/marketplace';
import type { CategorySlug } from '@/types';

const categories: CategorySlug[] = ['vegetables', 'fruits', 'grains', 'dairy', 'herbs', 'honey'];

export function ProductsPage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState(params.get('search') ?? '');
  const initialCategory = params.get('category') as CategorySlug | null;
  const [selected, setSelected] = useState<CategorySlug[]>(
    initialCategory ? [initialCategory] : [],
  );
  const products = useQuery({
    queryKey: ['products', search, selected],
    queryFn: () => getProducts({ search, categories: selected }),
  });
  const toggleCategory = (category: CategorySlug) =>
    setSelected((value) =>
      value.includes(category) ? value.filter((item) => item !== category) : [...value, category],
    );
  return (
    <>
      <section className="bg-primary-600 px-4 py-8 text-center text-white">
        <h1 className="text-4xl font-bold">Fresh Products</h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl">
          Quality produce, sourced directly from trusted local farmers.
        </p>
      </section>
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[16rem_1fr]">
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="text-lg font-semibold">Filters</h2>
          <label htmlFor="product-search" className="mt-5 block text-sm font-medium">
            Search
          </label>
          <input
            id="product-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-600"
            placeholder="Products or farms"
          />
          <fieldset className="mt-6">
            <legend className="mb-3 font-medium">Categories</legend>
            <div className="space-y-3">
              {categories.map((category) => (
                <label key={category} className="flex items-center gap-3 capitalize">
                  <input
                    type="checkbox"
                    checked={selected.includes(category)}
                    onChange={() => toggleCategory(category)}
                    className="rounded text-primary-600"
                  />
                  {category}
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-6 flex items-center gap-3">
            <input type="checkbox" className="rounded text-primary-600" />
            Organic only
          </label>
        </aside>
        <section aria-live="polite">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">All Products</h2>
              <p className="text-sm text-gray-500">{products.data?.length ?? 0} products found</p>
            </div>
            <select
              aria-label="Sort products"
              className="rounded-lg border bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
            >
              <option>Featured</option>
              <option>Price: Low to High</option>
              <option>Highest Rated</option>
            </select>
          </div>
          {products.isLoading ? (
            <PageLoader />
          ) : products.data?.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No products found"
              message="Try changing your search or selected categories."
            />
          )}
        </section>
      </div>
    </>
  );
}
