import { Icon } from '@/components/common/Icon';
import { ROUTES } from '@/constants/routes';
import { mockFarmers } from '@/mocks/data';
import { Link } from 'react-router-dom';

export function AboutPage() {
  const owner = mockFarmers[0]!;

  return (
    <div className="relative isolate flex-1 overflow-hidden bg-gradient-to-br from-emerald-100/80 via-emerald-50/60 to-lime-100/80 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/80">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-emerald-300/40 blur-3xl dark:bg-emerald-600/15" />
        <div className="absolute -right-28 top-[35%] h-[30rem] w-[30rem] rounded-full bg-lime-300/35 blur-3xl dark:bg-primary-700/15" />
        <div
          className="absolute inset-0 opacity-[0.065] dark:opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #16a34a 1px, transparent 1px), linear-gradient(to bottom, #16a34a 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
        <svg
          viewBox="0 0 220 260"
          className="absolute -left-10 top-72 w-56 -rotate-6 text-primary-600/20 sm:w-72 dark:text-emerald-400/10"
          fill="none"
        >
          <path d="M108 258C106 184 111 116 137 42" stroke="currentColor" strokeWidth="8" />
          <path d="M130 72C76 72 47 45 48 3C100 2 132 27 130 72Z" fill="currentColor" />
          <path d="M116 127C62 126 30 100 28 57C82 55 115 80 116 127Z" fill="currentColor" />
          <path d="M124 105C176 102 207 76 211 35C160 31 127 56 124 105Z" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 180 180"
          className="absolute -right-8 top-20 w-44 rotate-12 text-primary-600/20 sm:right-8 sm:w-56 dark:text-emerald-400/10"
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
      <section className="px-4 py-10 text-center sm:py-12">
        <span className="inline-flex rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary-700 shadow-sm backdrop-blur dark:border-primary-800 dark:bg-gray-900/60 dark:text-emerald-300">
          Our purpose
        </span>
        <h1 className="mt-4 text-4xl font-bold sm:text-5xl">About QuickEssentials</h1>
        <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 dark:text-gray-300 sm:text-xl">
          Helping you buy everyday essentials safely, simply, and with less hassle.
        </p>
      </section>
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="mt-6 text-lg leading-8 text-gray-700 dark:text-gray-300">
            QuickEssentials began with a simple idea: everyday shopping should feel easy, reliable,
            and stress-free.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-700 dark:text-gray-300">
            We help families find the essentials they need, order securely, and save valuable time
            through one convenient shopping experience.
          </p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
          alt="A peaceful landscape representing a simpler shopping experience"
          className="rounded-2xl shadow-lg"
        />
      </section>
      <section className="border-y border-white/60 bg-white/55 py-14 backdrop-blur-sm dark:border-gray-700/60 dark:bg-gray-900/55">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="relative mx-auto w-full max-w-sm">
            <span
              className="absolute -inset-3 -rotate-3 rounded-[2rem] bg-gradient-to-br from-emerald-200 to-emerald-600 opacity-70 dark:from-primary-800 dark:to-emerald-950"
              aria-hidden="true"
            />
            <img
              src={owner.avatar}
              alt={`${owner.name}, owner of QuickEssentials`}
              className="relative aspect-[4/5] w-full rounded-[1.6rem] object-cover shadow-xl"
            />
            <span className="absolute bottom-4 left-4 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-700 shadow-lg">
              <Icon name="certificate" className="mr-2" />
              Trusted leadership
            </span>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-600 dark:text-primary-400">
              About the owner
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{owner.name}</h2>
            <p className="mt-2 text-lg font-medium text-primary-700 dark:text-primary-300">
              Founder and owner of QuickEssentials
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-700 dark:text-gray-300">
              He created QuickEssentials to make buying everyday necessities simpler for busy
              families and individuals.
            </p>
            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
              He leads the platform with a focus on secure ordering, dependable service, and
              reducing the everyday hassle of shopping for essentials.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
                <Icon name="mapMarker" className="text-primary-600" />
                <span className="mt-2 block text-sm text-gray-500">Based in</span>
                <strong className="text-sm">{owner.location}</strong>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
                <Icon name="shield" className="text-primary-600" />
                <span className="mt-2 block text-sm text-gray-500">Building trust since</span>
                <strong>{owner.since}</strong>
              </div>
              <div className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-900">
                <Icon name="cart" className="text-primary-600" />
                <span className="mt-2 block text-sm text-gray-500">Our focus</span>
                <strong className="text-sm">Everyday essentials</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="bg-white/65 py-14 backdrop-blur-sm dark:bg-gray-900/45">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-center text-3xl font-bold">What We Stand For</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              ['leaf', 'Convenience', 'Everything you need is easier to find and order in one place.'],
              [
                'handshake',
                'Less Hassle',
                'A clear and simple experience saves time at every step.',
              ],
              ['award', 'Safety', 'Secure ordering and dependable service help you shop confidently.'],
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
      <section className="bg-gradient-to-r from-primary-700/95 via-primary-600/95 to-emerald-700/95 px-4 py-14 text-center text-white backdrop-blur-sm">
        <h2 className="text-3xl font-bold">Our Impact</h2>
        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {[
            ['5,000+', 'Orders Completed'],
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
      <section className="px-4 py-12 text-center">
        <h2 className="text-3xl font-bold">Ready to simplify your shopping?</h2>
        <Link
          to={ROUTES.home}
          className="mt-7 inline-block rounded-lg bg-primary-600 px-6 py-3 font-medium text-white hover:bg-primary-700"
        >
          Explore Products
        </Link>
      </section>
      </div>
    </div>
  );
}
