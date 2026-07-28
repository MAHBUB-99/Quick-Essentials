import { Link } from 'react-router-dom';
import { APP_TAGLINE } from '@/constants/app';
import { cn } from '@/utils/cn';

interface BrandLogoProps {
  inverse?: boolean;
  showTagline?: boolean;
  className?: string;
  markHref?: string;
}

/**
 * QuickEssentials' code-native brand mark: a young plant rising over curved fields.
 * It stays sharp at every size and does not require a separate image asset.
 */
export function BrandLogo({
  inverse = false,
  showTagline = true,
  className,
  markHref,
}: BrandLogoProps) {
  const mark = (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-lime-400 via-primary-500 to-emerald-700 shadow-md shadow-primary-900/20 ring-1 ring-white/20">
      <svg
        viewBox="0 0 48 48"
        className="h-9 w-9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path d="M24 36V19" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
        <path
          d="M23.8 24.5C16.2 24.2 11.8 19.8 12.3 12.3C19.8 11.9 24.2 16.4 23.8 24.5Z"
          fill="white"
          fillOpacity="0.96"
        />
        <path
          d="M24.6 20.8C26.2 13.6 31.2 9.8 38.4 11C38.5 18.2 33.7 22 24.6 23.2V20.8Z"
          fill="white"
          fillOpacity="0.82"
        />
        <path
          d="M7.5 36.5C13 32.6 18.3 32.6 24 36.5C29.7 40.4 35 40.4 40.5 36.5"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeOpacity="0.9"
        />
        <path
          d="M9.5 40C14.7 37.2 19.5 37.2 24.5 40C29.5 42.8 34.1 42.8 38.5 40"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeOpacity="0.48"
        />
      </svg>
    </span>
  );

  const wordmark = (
    <>
      {mark}
      <span className="min-w-0 text-left">
        <span
          className={cn(
            'block text-xl font-extrabold leading-none tracking-[-0.035em]',
            inverse ? 'text-white' : 'text-gray-900 dark:text-white',
          )}
        >
          Quick
          <span className={inverse ? 'text-emerald-300' : 'text-primary-600'}>Essentials</span>
        </span>
        {showTagline && (
          <span
            className={cn(
              'mt-1 block text-[10px] font-medium uppercase tracking-[0.12em]',
              inverse ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400',
            )}
          >
            {APP_TAGLINE}
          </span>
        )}
      </span>
    </>
  );

  const brandClassName = cn(
    'inline-flex items-center gap-3 rounded-[14px] focus-visible:ring-offset-4',
    className,
  );

  return markHref ? (
    <Link to={markHref} aria-label="Go to Products page" className={brandClassName}>
      {wordmark}
    </Link>
  ) : (
    <span className={brandClassName}>{wordmark}</span>
  );
}
