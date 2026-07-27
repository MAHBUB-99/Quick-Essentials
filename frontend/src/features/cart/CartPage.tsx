import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { EmptyState } from '@/components/feedback/PageState';
import { ROUTES } from '@/constants/routes';
import { useCart } from './CartContext';
import { formatCurrency } from '@/utils/format';

export function CartPage() {
  const { items, total, remove, setQuantity } = useCart();
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Shopping Cart</h1>
      {items.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          message="Fresh local produce is only a few clicks away."
        />
      ) : (
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
          <section className="space-y-4">
            {items.map((item) => (
              <article
                key={item.productId}
                className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow dark:bg-gray-800 sm:flex-row sm:items-center"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-24 w-24 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.farmName}</p>
                  <p className="mt-2 font-bold text-primary-600">
                    {formatCurrency(item.unitPrice)}/{item.unit}
                  </p>
                </div>
                <label className="text-sm">
                  Quantity
                  <input
                    type="number"
                    min="1"
                    max={item.maxQuantity}
                    value={item.quantity}
                    onChange={(event) => setQuantity(item.productId, Number(event.target.value))}
                    className="ml-2 w-16 rounded-lg border bg-transparent px-2 py-1"
                  />
                </label>
                <button
                  onClick={() => remove(item.productId)}
                  className="text-red-600"
                  aria-label={`Remove ${item.name}`}
                >
                  <Icon name="trash" />
                </button>
              </article>
            ))}
          </section>
          <aside className="h-fit rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h2 className="text-xl font-semibold">Order Summary</h2>
            <dl className="mt-5 space-y-3 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatCurrency(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Delivery</dt>
                <dd>{formatCurrency(50)}</dd>
              </div>
              <div className="flex justify-between border-t pt-4 text-lg font-bold text-gray-900 dark:text-white">
                <dt>Total</dt>
                <dd>{formatCurrency(total + 50)}</dd>
              </div>
            </dl>
            <Button asChild fullWidth size="lg" className="mt-6">
              <Link to={ROUTES.payment}>Proceed to Checkout</Link>
            </Button>
          </aside>
        </div>
      )}
      <Link to={ROUTES.products} className="mt-8 inline-block text-primary-600">
        ← Continue shopping
      </Link>
    </div>
  );
}
