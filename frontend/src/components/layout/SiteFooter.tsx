import { Link } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { APP_DESCRIPTION, APP_NAME, APP_TAGLINE } from '@/constants/app';
import { ROUTES } from '@/constants/routes';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-900 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-lg bg-primary-500 p-2">
              <Icon name="seedling" />
            </span>
            <div>
              <h2 className="text-xl font-bold">{APP_NAME}</h2>
              <p className="text-sm text-gray-400">{APP_TAGLINE}</p>
            </div>
          </div>
          <p className="text-gray-400">{APP_DESCRIPTION}</p>
        </div>
        <FooterLinks
          title="Quick Links"
          links={[
            [ROUTES.home, 'Home'],
            [ROUTES.products, 'Products'],
            [ROUTES.farmers, 'Farmers'],
            [ROUTES.about, 'About Us'],
          ]}
        />
        <FooterLinks
          title="For Farmers"
          links={[
            [ROUTES.register, 'Join as Farmer'],
            [ROUTES.dashboardProductNew, 'Add Products'],
            [ROUTES.dashboardProducts, 'Manage Listings'],
          ]}
        />
        <FooterLinks
          title="Support"
          links={[
            [ROUTES.orders, 'My Orders'],
            [ROUTES.forgotPassword, 'Account Help'],
            ['mailto:support@farmfresh.example', 'Contact Us'],
          ]}
        />
      </div>
      <div className="border-t border-gray-800 px-4 py-6 text-center text-sm text-gray-400">
        © 2026 FarmFresh. All rights reserved.
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: ReadonlyArray<readonly [string, string]>;
}) {
  return (
    <div>
      <h3 className="mb-4 font-semibold">{title}</h3>
      <ul className="space-y-2 text-gray-400">
        {links.map(([to, label]) => (
          <li key={label}>
            <Link to={to} className="hover:text-white">
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
