/** Shared primitive/domain-agnostic types. */

/** A generic paginated response shape mirroring a typical REST list endpoint. */
export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

/** Async UI status used by non-Query local state where helpful. */
export type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

export interface RatingSummary {
  /** Average rating, 0–5. */
  average: number;
  /** Total number of ratings. */
  count: number;
  /** Distribution: index 0 => 1 star … index 4 => 5 stars. */
  distribution?: [number, number, number, number, number];
}
