import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Field, TextareaField } from '@/components/forms/Field';
import { BrandedPageBackground } from '@/components/layout/BrandedPageBackground';
import { ROUTES } from '@/constants/routes';
import { useCart } from '@/features/cart/CartContext';
import { formatCurrency } from '@/utils/format';

const orderSchema = z.object({
  name: z.string().min(2, 'Customer name is required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  address: z.string().min(8, 'Delivery address is required'),
});
type OrderValues = z.infer<typeof orderSchema>;

export function PaymentPage() {
  const { items, count, total, remove, setQuantity, clear } = useCart();
  const navigate = useNavigate();
  const deliveryFee = items.length > 0 ? 50 : 0;
  const orderTotal = total + deliveryFee;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderValues>({ resolver: zodResolver(orderSchema) });
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    clear();
    void navigate(ROUTES.orderSuccess);
  };
  return (
    <BrandedPageBackground>
      <div className="mx-auto max-w-5xl px-4 pb-10 pt-3">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-100 text-lg text-primary-700 dark:bg-primary-900 dark:text-white">
          <Icon name="boxOpen" />
        </span>
        <span className="text-base font-bold uppercase tracking-[0.14em] text-primary-600 dark:text-emerald-400">
          Checkout
        </span>
      </div>
      <form
        onSubmit={(event) => void handleSubmit(submit)(event)}
        className="grid items-start gap-5 lg:grid-cols-[1fr_19rem]"
      >
        <section className="relative space-y-4 overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 pt-3 shadow-md dark:border-gray-700 dark:bg-gray-800">
          <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary-600 via-emerald-400 to-primary-700" />
          <header className="text-center">
            <h1 className="text-2xl font-bold leading-tight sm:text-3xl">Place Your Order</h1>
            <p className="mx-auto mt-1.5 max-w-xl text-sm text-gray-500 dark:text-gray-400">
              Almost there—add your delivery details and we’ll bring everything to your door.
            </p>
          </header>

          <div className="flex items-center gap-3 rounded-lg border border-primary-100 bg-primary-50 p-3 text-primary-900 dark:border-primary-700 dark:bg-primary-900/40 dark:text-white">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-primary-700 shadow-sm dark:bg-primary-800 dark:text-white">
              <Icon name="truck" />
            </span>
            <div>
              <p className="text-sm font-semibold">Cash on Delivery</p>
              <p className="text-xs text-primary-700 dark:text-gray-300">
                Pay in cash when your order arrives.
              </p>
            </div>
          </div>
          <h2 className="text-lg font-semibold">Delivery Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="customer-name"
              label="Customer name"
              className="py-2"
              error={errors.name?.message}
              {...register('name')}
            />
            <Field
              id="customer-phone"
              label="Phone number"
              className="py-2"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <div className="sm:col-span-2">
              <TextareaField
                id="delivery-address"
                label="Delivery address"
                rows={2}
                className="py-2"
                error={errors.address?.message}
                {...register('address')}
              />
            </div>
          </div>
          <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" className="rounded" />
            Save these details for future orders
          </label>
        </section>
        <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-md dark:border-gray-700 dark:bg-gray-800 lg:sticky lg:top-20">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            {items.length > 0 && (
              <span className="rounded-full bg-primary-50 px-2.5 py-1 text-[11px] font-semibold text-primary-700 dark:bg-primary-900/50 dark:text-emerald-300">
                {count} {count === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <div className="mt-4 space-y-3">
            {items.length ? (
              items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <img src={item.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 text-[10px] text-gray-600 hover:border-primary-500 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-gray-600 dark:text-gray-300"
                        aria-label={`Reduce ${item.name} quantity`}
                      >
                        <Icon name="minus" />
                      </button>
                      <span className="min-w-6 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.maxQuantity}
                        className="flex h-6 w-6 items-center justify-center rounded-md border border-gray-300 text-[10px] text-gray-600 hover:border-primary-500 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-35 dark:border-gray-600 dark:text-gray-300"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Icon name="plus" />
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(item.productId)}
                        className="ml-auto flex h-6 w-6 items-center justify-center rounded-md text-xs text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
                        aria-label={`Remove ${item.name} from order`}
                      >
                        <Icon name="trash" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="rounded-lg bg-gray-50 px-3 py-4 text-center text-sm text-gray-500 dark:bg-gray-900/50">
                Your order is empty.
              </p>
            )}
          </div>
          <dl className="mt-4 space-y-2 border-t pt-4 text-sm dark:border-gray-700">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatCurrency(deliveryFee)}</dd>
            </div>
            <div className="flex justify-between border-t pt-2 text-base font-bold dark:border-gray-700">
              <dt>Total</dt>
              <dd>{formatCurrency(orderTotal)}</dd>
            </div>
          </dl>
          <Button
            type="submit"
            fullWidth
            className="mt-4"
            isLoading={isSubmitting}
            disabled={items.length === 0}
          >
            Place Order
          </Button>
          <div className="mt-3 flex items-start justify-center gap-2 rounded-lg bg-gray-50 px-3 py-2.5 text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
            <Icon name="truck" className="mt-0.5 shrink-0 text-primary-600" />
            <p className="text-[11px] leading-4">
              No advance payment required. Pay when your order is delivered.
            </p>
          </div>
        </aside>
      </form>
      </div>
    </BrandedPageBackground>
  );
}

export function PaymentSuccessPage() {
  const [showReceipt, setShowReceipt] = useState(false);

  return (
    <BrandedPageBackground>
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-emerald-200 bg-white/80 text-3xl text-green-600 shadow-xl shadow-primary-900/10 backdrop-blur dark:border-primary-700 dark:bg-gray-800/80 dark:text-emerald-400">
        <Icon name="check" />
      </div>
      <h1 className="mt-6 text-4xl font-bold">Order Placed Successfully!</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Your order is confirmed. Please pay in cash when it arrives.
      </p>
      <div className="mt-10 rounded-2xl border border-white/80 bg-white/80 p-7 text-left shadow-xl shadow-primary-900/10 backdrop-blur-xl dark:border-gray-700/80 dark:bg-gray-800/80">
        <h2 className="text-xl font-semibold">Order Confirmation</h2>
        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Order number</dt>
            <dd className="font-medium">QE-2026-001234</dd>
          </div>
          <div>
            <dt className="text-gray-500">Payment method</dt>
            <dd className="font-medium">Cash on Delivery</dd>
          </div>
          <div>
            <dt className="text-gray-500">Estimated delivery</dt>
            <dd className="font-medium">July 29, 2026</dd>
          </div>
          <div>
            <dt className="text-gray-500">Payment status</dt>
            <dd className="font-medium text-amber-600">Due on delivery</dd>
          </div>
        </dl>
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button size="lg" onClick={() => setShowReceipt((value) => !value)}>
          <Icon name="eye" />
          {showReceipt ? 'Hide Receipt' : 'View Receipt'}
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to={ROUTES.home}>Continue Shopping</Link>
        </Button>
      </div>
      {showReceipt && (
        <section
          id="order-receipt"
          className="mt-8 rounded-2xl border border-white/80 bg-white/85 p-7 text-left shadow-xl shadow-primary-900/10 backdrop-blur-xl dark:border-gray-700/80 dark:bg-gray-800/85"
          aria-label="Order receipt"
        >
          <div className="flex items-start justify-between border-b pb-5 dark:border-gray-700">
            <div>
              <h2 className="text-2xl font-bold">QuickEssentials</h2>
              <p className="mt-1 text-sm text-gray-500">Order Receipt</p>
            </div>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
              Cash on Delivery
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-5 py-6 text-sm">
            <div>
              <dt className="text-gray-500">Order number</dt>
              <dd className="mt-1 font-semibold">QE-2026-001234</dd>
            </div>
            <div>
              <dt className="text-gray-500">Order date</dt>
              <dd className="mt-1 font-semibold">July 28, 2026</dd>
            </div>
            <div>
              <dt className="text-gray-500">Estimated delivery</dt>
              <dd className="mt-1 font-semibold">July 29, 2026</dd>
            </div>
            <div>
              <dt className="text-gray-500">Amount due</dt>
              <dd className="mt-1 font-semibold text-primary-600">{formatCurrency(275)}</dd>
            </div>
          </dl>
          <div className="border-t pt-5 text-sm dark:border-gray-700">
            <p className="font-medium">Payment due when the order is delivered.</p>
            <p className="mt-1 text-gray-500">Thank you for shopping with QuickEssentials.</p>
          </div>
        </section>
      )}
      </div>
    </BrandedPageBackground>
  );
}
