import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { PageLoader } from '@/components/feedback/PageState';
import { ROUTES } from '@/constants/routes';
import { getOrders } from '@/services/api/marketplace';
import { formatCurrency, formatDate } from '@/utils/format';

export function OrdersPage() {
  const orders = useQuery({ queryKey: ['orders'], queryFn: getOrders });
  if (orders.isLoading) return <PageLoader label="Loading orders" />;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">My Orders</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Track and manage your orders</p>
        </div>
        <select
          className="rounded-lg border bg-white px-4 py-2 dark:border-gray-600 dark:bg-gray-800"
          aria-label="Filter orders"
        >
          <option>All Orders</option>
          <option>Delivered</option>
          <option>Pending</option>
        </select>
      </div>
      <div className="space-y-6">
        {orders.data?.map((order) => (
          <article
            key={order.id}
            className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800"
          >
            <header className="flex flex-col justify-between gap-3 p-6 sm:flex-row">
              <div>
                <h2 className="text-lg font-semibold">Order #{order.reference}</h2>
                <p className="text-sm text-gray-500">Placed on {formatDate(order.placedAt)}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium capitalize text-green-800">
                  {order.status}
                </span>
                <strong>{formatCurrency(order.total)}</strong>
              </div>
            </header>
            <div className="border-t p-6 dark:border-gray-700">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {item.unit}
                    </p>
                  </div>
                  <span>{formatCurrency(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
            <footer className="flex flex-wrap gap-3 border-t p-6 dark:border-gray-700">
              <Button size="sm">
                <Icon name="download" /> Receipt
              </Button>
              <Button size="sm" variant="outline" asChild>
                <Link to={`${ROUTES.orders}/${order.id}/review`}>
                  <Icon name="star" /> Write Review
                </Link>
              </Button>
              <Button size="sm" variant="outline">
                <Icon name="redo" /> Buy Again
              </Button>
            </footer>
          </article>
        ))}
      </div>
    </div>
  );
}
