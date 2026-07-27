import { Icon } from '@/components/common/Icon';
import { ROUTES } from '@/constants/routes';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <>
      <section className="bg-primary-600 px-4 py-8 text-center text-white">
        <h1 className="text-4xl font-bold">About FarmFresh</h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl text-primary-100">
          Connecting communities with the people who grow their food.
        </p>
      </section>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="mt-6 text-lg leading-8 text-gray-700 dark:text-gray-300">
            FarmFresh began with a simple idea: make local, high-quality food easier to discover
            while ensuring farmers receive fair value for their work.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-700 dark:text-gray-300">
            Today, we help families buy confidently from verified producers across Bangladesh.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
          alt="A green local farm at sunrise"
          className="rounded-2xl shadow-lg"
        />
      </section>
      <section className="bg-white py-16 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">What We Stand For</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ['leaf', 'Freshness', 'Shorter journeys mean fresher, more flavorful food.'],
              [
                'handshake',
                'Fair Partnership',
                'Farmers set fair prices and build lasting customer relationships.',
              ],
              ['award', 'Quality', 'Verified producers and transparent sourcing build trust.'],
            ].map(([icon, title, text]) => (
              <div key={title} className="text-center">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900">
                  <Icon name={icon as 'leaf' | 'handshake' | 'award'} className="text-2xl" />
                </span>
                <h3 className="mt-4 text-xl font-semibold">{title}</h3>
                <p className="mt-3 text-gray-600 dark:text-gray-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-primary-600 px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Our Impact</h2>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            ['500+', 'Active Farmers'],
            ['10,000+', 'Happy Customers'],
            ['50+', 'Districts Covered'],
            ['2,000+', 'Products Available'],
          ].map(([number, label]) => (
            <div key={label}>
              <strong className="block text-4xl">{number}</strong>
              <span className="text-primary-100">{label}</span>
            </div>
          ))}
        </div>
      </section>
      <section className="px-4 py-16 text-center">
        <h2 className="text-3xl font-bold">Ready to shop local?</h2>
        <Link
          to={ROUTES.products}
          className="mt-7 inline-block rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700"
        >
          Explore Products
        </Link>
      </section>
    </>
  );
}
