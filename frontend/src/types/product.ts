import type { RatingSummary } from './common';

/** Product category slugs — align with the create/filter selects in the templates. */
export type CategorySlug = 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'herbs' | 'honey';

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Font Awesome icon name (solid), e.g. "carrot". */
  icon: string;
  /** Tailwind color family used by the category tile on the home page. */
  colorScheme: 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'orange';
  productCount: number;
}

/** Selling unit — mirrors the create.html unit <select>. */
export type ProductUnit = 'kg' | 'lbs' | 'piece' | 'liter' | 'dozen' | 'bundle';

/** Product feature tags — mirrors the create.html feature checkboxes. */
export type ProductFeature =
  | 'organic'
  | 'pesticide-free'
  | 'fresh'
  | 'non-gmo'
  | 'local'
  | 'sustainable'
  | 'fair-trade'
  | 'gluten-free';

export type ProductStatus = 'active' | 'inactive' | 'out-of-stock';

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CategorySlug;
  price: number;
  unit: ProductUnit;
  stock: number;
  images: string[];
  features: ProductFeature[];
  rating: RatingSummary;
  farmerId: string;
  farmName: string;
  location: string;
  harvestDate?: string;
  status: ProductStatus;
  /** Total lifetime purchases — used to compute "Featured" products. */
  purchaseCount: number;
  createdAt: string;
}

/** Filters accepted by the products listing service. */
export interface ProductQuery {
  search?: string;
  categories?: CategorySlug[];
  priceMin?: number;
  priceMax?: number;
  location?: string;
  organicOnly?: boolean;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export type ProductSort = 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
