/**
 * Centralized route paths. Import these instead of hardcoding strings so route
 * changes stay in one place and links are type-checked.
 */
export const ROUTES = {
  home: '/',
  products: '/products',
  productDetails: (id: string | number = ':id') => `/products/${id}`,
  about: '/about',
  faq: '/faq',
  support: '/support',
  cart: '/cart',
  favourites: '/favourites',
  login: '/login',
  register: '/register',
  forgotPassword: '/forgot-password',
  payment: '/payment',
  orderSuccess: '/order-success',
  orders: '/orders',
  // Farmer dashboard (role-guarded)
  dashboardProducts: '/dashboard/products',
  dashboardProductNew: '/dashboard/products/new',
  dashboardProductEdit: (id: string | number = ':id') => `/dashboard/products/${id}/edit`,
  dashboardCategories: '/dashboard/categories',
  dashboardNotifications: '/dashboard/notifications',
  unauthorized: '/unauthorized',
} as const;

/** Route path literals for the details route param pattern (router config). */
export const ROUTE_PATTERNS = {
  productDetails: '/products/:id',
  dashboardProductEdit: '/dashboard/products/:id/edit',
} as const;
