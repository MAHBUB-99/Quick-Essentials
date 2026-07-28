import type { ReactNode } from 'react';
import { Icon } from '@/components/common/Icon';
import type { IconName } from '@/lib/icons';

type BannerMotif = 'produce' | 'farmers' | 'about';

const motifIcons: Record<BannerMotif, [IconName, IconName]> = {
  produce: ['leaf', 'carrot'],
  farmers: ['leaf', 'tractor'],
  about: ['leaf', 'seedling'],
};

/**
 * Decorative background for existing inner-page green banners.
 * Content and spacing are supplied by each page and remain unchanged.
 */
export function FarmPageBanner({
  children,
  motif,
}: {
  children: ReactNode;
  motif: BannerMotif;
}) {
  const [leftIcon, rightIcon] = motifIcons[motif];

  return (
    <section className="relative isolate overflow-hidden bg-[linear-gradient(110deg,#22c55e_0%,#16a34a_35%,#15803d_68%,#14532d_100%)] px-4 py-8 text-center text-white shadow-inner">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(190,242,100,0.24),transparent_27%),radial-gradient(circle_at_82%_70%,rgba(5,46,22,0.28),transparent_34%)]" />
        <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.16)_1px,transparent_1.5px)] bg-[length:24px_24px] opacity-[0.1] [mask-image:linear-gradient(to_bottom,black,transparent_92%)]" />
        <span className="absolute -left-24 -top-44 h-72 w-72 rounded-full border border-white/10 bg-white/[0.03]" />
        <span className="absolute -bottom-56 -right-20 h-80 w-80 rounded-full border border-white/10 bg-emerald-950/10" />

        <Icon
          name={leftIcon}
          className="absolute -left-2 bottom-1 -rotate-12 text-6xl text-white/[0.05] sm:left-[6%]"
        />
        <Icon
          name={rightIcon}
          className="absolute right-[6%] top-2 rotate-12 text-7xl text-white/[0.055]"
        />

        {motif === 'about' && (
          <>
            <svg
              viewBox="0 0 180 180"
              className="absolute -left-2 top-1/2 hidden w-32 -translate-y-1/2 -rotate-6 text-white/[0.13] sm:block lg:left-[7%] lg:w-40"
              fill="none"
            >
              <path
                d="M42 60H138L128 153H52L42 60Z"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinejoin="round"
              />
              <path
                d="M65 64C65 33 79 20 90 20C101 20 115 33 115 64"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path d="M90 88V128" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              <path
                d="M90 104C71 103 62 94 63 80C81 79 91 87 90 104Z"
                fill="currentColor"
              />
              <path
                d="M91 96C105 95 114 88 116 76C102 74 93 81 91 96Z"
                fill="currentColor"
              />
            </svg>

            <svg
              viewBox="0 0 190 170"
              className="absolute -right-3 top-1/2 hidden w-36 -translate-y-1/2 rotate-6 text-lime-100/[0.15] sm:block lg:right-[7%] lg:w-44"
              fill="none"
            >
              <path d="M86 165C86 119 91 78 108 31" stroke="currentColor" strokeWidth="7" />
              <path d="M105 55C66 54 46 36 47 8C83 7 106 24 105 55Z" fill="currentColor" />
              <path d="M96 94C58 92 35 75 34 45C72 44 95 61 96 94Z" fill="currentColor" />
              <path d="M100 80C138 78 159 61 162 32C126 29 102 47 100 80Z" fill="currentColor" />
            </svg>
          </>
        )}

        <svg
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className="absolute inset-x-0 bottom-0 h-20 w-full"
        >
          <path
            d="M0 58C175 29 338 79 526 55C719 31 854 71 1032 51C1207 33 1327 46 1440 32V100H0Z"
            fill="rgba(20,83,45,0.25)"
          />
          <path
            d="M0 75C221 48 361 87 579 66C791 47 953 80 1165 58C1275 46 1369 51 1440 44V100H0Z"
            fill="rgba(5,46,22,0.22)"
          />
          <path
            d="M0 88C260 68 431 93 677 79C928 64 1136 91 1440 69V100H0Z"
            fill="rgba(255,255,255,0.03)"
          />
        </svg>
      </div>

      <div className="relative z-10">{children}</div>
    </section>
  );
}
