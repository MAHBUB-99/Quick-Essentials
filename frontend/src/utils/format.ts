import { CURRENCY_SYMBOL } from '@/constants/app';

/**
 * Format a numeric amount as Bangladeshi Taka, matching the templates' `৳45`
 * style (no decimals for whole numbers, up to 2 otherwise).
 */
export function formatCurrency(amount: number): string {
  const hasFraction = amount % 1 !== 0;
  const value = amount.toLocaleString('en-US', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  });
  return `${CURRENCY_SYMBOL}${value}`;
}

/** Compact count for social-proof labels, e.g. 10000 -> "10k+". */
export function formatCompact(value: number): string {
  return Intl.NumberFormat('en', { notation: 'compact' }).format(value);
}

/** Format an ISO date string as a readable, locale-stable label. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Relative time such as "2 days ago" used by review items. */
export function formatRelativeTime(iso: string, now: number = Date.now()): string {
  const diffMs = now - new Date(iso).getTime();
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 1000 * 60 * 60 * 24 * 365],
    ['month', 1000 * 60 * 60 * 24 * 30],
    ['week', 1000 * 60 * 60 * 24 * 7],
    ['day', 1000 * 60 * 60 * 24],
    ['hour', 1000 * 60 * 60],
    ['minute', 1000 * 60],
  ];
  for (const [unit, ms] of units) {
    const delta = Math.round(diffMs / ms);
    if (Math.abs(delta) >= 1) return rtf.format(-delta, unit);
  }
  return 'just now';
}
