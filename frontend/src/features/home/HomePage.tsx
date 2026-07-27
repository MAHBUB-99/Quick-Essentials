import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useState, type FormEvent } from 'react';
import { ProductCard } from '@/components/cards/ProductCard';
import { Icon } from '@/components/common/Icon';
import { PageLoader } from '@/components/feedback/PageState';
import { ROUTES } from '@/constants/routes';
import { getProducts } from '@/services/api/marketplace';

const categories = [
  ['carrot', 'Vegetables', 'Fresh & organic', 'bg-green-100 text-green-600 dark:bg-green-900'],
  ['appleAlt', 'Fruits', 'Sweet & seasonal', 'bg-red-100 text-red-600 dark:bg-red-900'],
  ['seedling', 'Grains', 'Local staples', 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900'],
  ['cheese', 'Dairy', 'Farm fresh', 'bg-blue-100 text-blue-600 dark:bg-blue-900'],
  ['leaf', 'Herbs', 'Aromatic greens', 'bg-purple-100 text-purple-600 dark:bg-purple-900'],
  ['jar', 'Honey', 'Raw & natural', 'bg-orange-100 text-orange-600 dark:bg-orange-900'],
] as const;

export function HomePage() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const products = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => getProducts({ sort: 'featured' }),
  });
  const submit = (event: FormEvent) => {
    event.preventDefault();
    void navigate(`${ROUTES.products}?search=${encodeURIComponent(search)}`);
  };
  return (
    <>
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-primary-500 via-primary-700 to-primary-900 px-4 py-10 text-white">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_1px,transparent_1.5px)] bg-[length:26px_26px] opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
          <span className="absolute -left-24 -top-28 h-80 w-80 rounded-full border border-white/10 bg-white/5" />
          <span className="absolute -bottom-44 -right-20 h-96 w-96 rounded-full border border-white/10 bg-black/10" />
          <span className="bg-primary-300/10 absolute left-[12%] top-10 h-24 w-24 rounded-full blur-2xl" />
          <span className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-lime-300/15 blur-3xl" />
          <span className="absolute right-[18%] top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <svg
            viewBox="0 0 1440 180"
            preserveAspectRatio="none"
            className="absolute inset-x-0 bottom-0 h-36 w-full opacity-50"
          >
            <path
              d="M0 118C180 58 330 164 520 112C714 58 830 142 1010 105C1190 68 1310 100 1440 58V180H0Z"
              fill="rgba(20,83,45,0.42)"
            />
            <path
              d="M0 148C215 92 340 178 570 135C790 94 935 167 1160 116C1270 91 1365 105 1440 92V180H0Z"
              fill="rgba(5,46,22,0.34)"
            />
            <path
              d="M0 163C250 127 425 183 675 151C925 119 1130 179 1440 130V180H0Z"
              fill="rgba(255,255,255,0.06)"
            />
          </svg>
          <Icon
            name="leaf"
            className="absolute -left-3 bottom-4 -rotate-12 text-8xl text-white/[0.08] sm:left-[5%]"
          />
          <Icon
            name="seedling"
            className="absolute right-[5%] top-5 rotate-12 text-8xl text-white/[0.08] sm:text-9xl"
          />
          <Icon
            name="carrot"
            className="absolute bottom-7 right-[18%] hidden -rotate-12 text-5xl text-white/[0.06] md:block"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl text-center">
          <h1 className="text-3xl font-bold md:text-6xl">
            Fresh From Local Farms
            <br />
            <span className="text-primary-100">Straight to Your Table</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-xl text-primary-100">
            Discover fresh, organic produce directly from trusted local farmers. Support your
            community and enjoy better food.
          </p>
          <form
            onSubmit={submit}
            className="mx-auto mt-8 flex max-w-2xl flex-col overflow-hidden rounded-xl bg-white p-2 shadow-2xl sm:flex-row"
          >
            <label htmlFor="hero-search" className="sr-only">
              Search products
            </label>
            <input
              id="hero-search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="flex-1 px-4 py-3 text-gray-900 outline-none"
              placeholder="What fresh produce are you looking for?"
            />
            <button className="rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700">
              <Icon name="search" className="mr-2" />
              Search
            </button>
          </form>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Browse Categories</h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            Find exactly what you need from local producers
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {categories.map(([icon, title, text, color]) => (
            <Link
              key={title}
              to={`${ROUTES.products}?category=${title.toLowerCase()}`}
              className="rounded-2xl bg-white p-6 text-center shadow-md transition hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800"
            >
              <span
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${color}`}
              >
                <Icon name={icon} className="text-2xl" />
              </span>
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-1 text-xs text-gray-500">{text}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Fresh picks loved by our community
              </p>
            </div>
            <Link to={ROUTES.products} className="font-medium text-primary-600">
              View all <Icon name="arrowRight" />
            </Link>
          </div>
          {products.isLoading ? (
            <PageLoader />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.data?.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 text-center md:grid-cols-3">
        {[
          ['truck', 'Farm to Door', 'Fast delivery from nearby farms keeps every order fresh.'],
          ['shield', 'Quality Guaranteed', 'Every farmer and product is checked for quality.'],
          ['handshake', 'Support Local', 'Your purchase directly supports farming families.'],
        ].map(([icon, title, text]) => (
          <div key={title}>
            <Icon
              name={icon as 'truck' | 'shield' | 'handshake'}
              className="mb-4 text-4xl text-primary-600"
            />
            <h3 className="text-xl font-semibold">{title}</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">{text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
