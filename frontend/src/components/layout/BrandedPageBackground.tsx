import type { ReactNode } from 'react';
import { cn } from '@/utils/cn';

export function BrandedPageBackground({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'relative isolate flex-1 overflow-hidden bg-gradient-to-br from-emerald-100/80 via-emerald-50/60 to-lime-100/80 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/80',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-16 h-96 w-96 rounded-full bg-emerald-300/35 blur-3xl dark:bg-emerald-600/10" />
        <div className="absolute -right-28 top-[45%] h-[30rem] w-[30rem] rounded-full bg-lime-300/35 blur-3xl dark:bg-primary-700/15" />
        <div
          className="absolute inset-0 opacity-[0.06] dark:opacity-[0.055]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #16a34a 1px, transparent 1px), linear-gradient(to bottom, #16a34a 1px, transparent 1px)',
            backgroundSize: '42px 42px',
          }}
        />
        <svg
          viewBox="0 0 220 260"
          className="absolute -left-12 bottom-8 w-56 -rotate-6 text-primary-600/[0.16] sm:w-72 dark:text-emerald-400/[0.07]"
          fill="none"
        >
          <path d="M108 258C106 184 111 116 137 42" stroke="currentColor" strokeWidth="8" />
          <path d="M130 72C76 72 47 45 48 3C100 2 132 27 130 72Z" fill="currentColor" />
          <path d="M116 127C62 126 30 100 28 57C82 55 115 80 116 127Z" fill="currentColor" />
          <path d="M124 105C176 102 207 76 211 35C160 31 127 56 124 105Z" fill="currentColor" />
        </svg>
        <svg
          viewBox="0 0 180 180"
          className="absolute -right-10 top-20 w-44 rotate-12 text-primary-600/[0.16] sm:right-8 sm:w-56 dark:text-emerald-400/[0.07]"
          fill="none"
        >
          <path
            d="M42 60H138L128 153H52L42 60Z"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <path
            d="M65 64C65 33 79 20 90 20C101 20 115 33 115 64"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path d="M90 88V128" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
          <path d="M90 104C71 103 62 94 63 80C81 79 91 87 90 104Z" fill="currentColor" />
          <path d="M91 96C105 95 114 88 116 76C102 74 93 81 91 96Z" fill="currentColor" />
        </svg>
      </div>
      <div className="relative z-10">{children}</div>
    </div>
  );
}
