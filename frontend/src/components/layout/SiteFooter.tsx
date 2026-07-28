import { Link } from 'react-router-dom';
import { BrandLogo } from '@/components/common/BrandLogo';
import { Icon } from '@/components/common/Icon';
import { APP_DESCRIPTION, APP_NAME, SUPPORT_EMAIL } from '@/constants/app';
import { ROUTES } from '@/constants/routes';

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-gray-800 bg-gray-900 text-white">
      <div>
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-8 gap-y-7 px-4 py-7 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.2fr_1.5fr_0.7fr_0.7fr_0.7fr] lg:px-8">
          <div className="col-span-2 md:col-span-1">
            <BrandLogo inverse className="mb-3" />
            <p className="max-w-sm text-sm leading-6 text-gray-400">{APP_DESCRIPTION}</p>
          </div>
          <div className="col-span-2 space-y-3 md:col-span-1">
            {[
              [
                'truck',
                'Less Hassle',
                'Find and order your everyday essentials in just a few simple steps.',
              ],
              [
                'shield',
                'Secure Shopping',
                'Your information and every order are handled safely and reliably.',
              ],
            ].map(([icon, title, text]) => (
              <div key={title} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center text-emerald-400">
                  <Icon
                    name={icon as 'truck' | 'shield'}
                    className="text-sm"
                  />
                </span>
                <div className="min-w-0">
                  <h2 className="text-xs font-semibold text-white">{title}</h2>
                  <p className="mt-0.5 text-xs leading-4 text-gray-400">{text}</p>
                </div>
              </div>
            ))}
          </div>
          <FooterLinks
            title="Quick Links"
            links={[
              [ROUTES.home, 'Products'],
              [ROUTES.about, 'About Us'],
            ]}
          />
          <FooterLinks
            title="Shop"
            links={[
              [ROUTES.home, 'Browse Essentials'],
              [ROUTES.cart, 'Shopping Cart'],
              [ROUTES.orders, 'Track Orders'],
            ]}
          />
          <FooterLinks
            title="Support"
            links={[
              [ROUTES.orders, 'My Orders'],
              [ROUTES.forgotPassword, 'Account Help'],
              [`mailto:${SUPPORT_EMAIL}`, 'Contact Us'],
            ]}
          />
        </div>
      </div>
      <div className="border-t border-gray-800 px-4 py-3.5 text-center text-xs text-gray-400">
        © 2026 {APP_NAME}. All rights reserved.
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
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      <ul className="space-y-1.5 text-sm text-gray-400">
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
