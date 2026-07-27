import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { ROUTES } from '@/constants/routes';

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-7xl font-bold text-primary-600">404</p>
      <h1 className="mt-5 text-3xl font-bold">Page not found</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        The page may have moved or no longer exists.
      </p>
      <Button asChild className="mt-7">
        <Link to={ROUTES.home}>Return Home</Link>
      </Button>
    </div>
  );
}

export function UnauthorizedPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-6xl">🔒</p>
      <h1 className="mt-5 text-3xl font-bold">Access restricted</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Sign in with an authorized farmer account to view this page.
      </p>
      <Button asChild className="mt-7">
        <Link to={ROUTES.login}>Sign In</Link>
      </Button>
    </div>
  );
}

export function RouteErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : 'Something unexpected happened.';
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="text-3xl font-bold">We couldn’t load this page</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">{message}</p>
      <Button className="mt-7" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  );
}
