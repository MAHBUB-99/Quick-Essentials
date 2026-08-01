import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';
import { MarketplaceLayout } from '@/app/layouts/MarketplaceLayout';
import { PageLoader } from '@/components/feedback/PageState';
import { ROUTES, ROUTE_PATTERNS } from '@/constants/routes';
import { NotFoundPage, RouteErrorPage, UnauthorizedPage } from '@/features/errors/ErrorPages';

const HomePage = lazy(() =>
  import('@/features/home/HomePage').then((module) => ({ default: module.HomePage })),
);
const ProductDetailsPage = lazy(() =>
  import('@/features/products/ProductDetailsPage').then((module) => ({
    default: module.ProductDetailsPage,
  })),
);
const AboutPage = lazy(() =>
  import('@/features/about/AboutPage').then((module) => ({ default: module.AboutPage })),
);
const CartPage = lazy(() =>
  import('@/features/cart/CartPage').then((module) => ({ default: module.CartPage })),
);
const LoginPage = lazy(() =>
  import('@/features/auth/AuthPages').then((module) => ({ default: module.LoginPage })),
);
const RegisterPage = lazy(() =>
  import('@/features/auth/AuthPages').then((module) => ({ default: module.RegisterPage })),
);
const ForgotPasswordPage = lazy(() =>
  import('@/features/auth/AuthPages').then((module) => ({ default: module.ForgotPasswordPage })),
);
const PaymentPage = lazy(() =>
  import('@/features/payment/PaymentPages').then((module) => ({ default: module.PaymentPage })),
);
const PaymentSuccessPage = lazy(() =>
  import('@/features/payment/PaymentPages').then((module) => ({
    default: module.PaymentSuccessPage,
  })),
);
const OrdersPage = lazy(() =>
  import('@/features/booking/OrdersPage').then((module) => ({ default: module.OrdersPage })),
);
const ReviewPage = lazy(() =>
  import('@/features/booking/ReviewPage').then((module) => ({ default: module.ReviewPage })),
);
const CreateListingPage = lazy(() =>
  import('@/features/dashboard/DashboardPages').then((module) => ({
    default: module.CreateListingPage,
  })),
);
const ManageListingsPage = lazy(() =>
  import('@/features/dashboard/DashboardPages').then((module) => ({
    default: module.ManageListingsPage,
  })),
);

const suspense = (element: React.ReactNode) => (
  <Suspense fallback={<PageLoader />}>{element}</Suspense>
);
const ManageCategoriesPage = lazy(() =>
  import('@/features/dashboard/DashboardPages').then((module) => ({
    default: module.ManageCategoriesPage,
  })),
);
const EditListingPage = lazy(() =>
  import('@/features/dashboard/DashboardPages').then((module) => ({
    default: module.EditListingPage,
  })),
);

function AdminRoute() {
  const isAdmin = window.sessionStorage.getItem('quickessentials-admin') === 'true';
  return isAdmin ? <Outlet /> : <Navigate to={ROUTES.login} replace />;
}

const router = createBrowserRouter([
  {
    element: <MarketplaceLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: ROUTES.home, element: suspense(<HomePage />) },
      { path: ROUTES.products, element: <Navigate to={ROUTES.home} replace /> },
      { path: ROUTE_PATTERNS.productDetails, element: suspense(<ProductDetailsPage />) },
      { path: ROUTES.about, element: suspense(<AboutPage />) },
      { path: ROUTES.cart, element: suspense(<CartPage />) },
      { path: ROUTES.login, element: suspense(<LoginPage />) },
      { path: ROUTES.register, element: suspense(<RegisterPage />) },
      { path: ROUTES.forgotPassword, element: suspense(<ForgotPasswordPage />) },
      { path: ROUTES.payment, element: suspense(<PaymentPage />) },
      { path: ROUTES.orderSuccess, element: suspense(<PaymentSuccessPage />) },
      { path: ROUTES.orders, element: suspense(<OrdersPage />) },
      { path: `${ROUTES.orders}/:id/review`, element: suspense(<ReviewPage />) },
      {
        element: <AdminRoute />,
        children: [
          { path: ROUTES.dashboardProducts, element: suspense(<ManageListingsPage />) },
          { path: ROUTES.dashboardProductNew, element: suspense(<CreateListingPage />) },
          { path: ROUTE_PATTERNS.dashboardProductEdit, element: suspense(<EditListingPage />) },
          { path: ROUTES.dashboardCategories, element: suspense(<ManageCategoriesPage />) },
        ],
      },
      { path: ROUTES.unauthorized, element: <UnauthorizedPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
