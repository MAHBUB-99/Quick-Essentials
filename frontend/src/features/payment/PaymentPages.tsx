import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Field, TextareaField } from '@/components/forms/Field';
import { ROUTES } from '@/constants/routes';
import { useCart } from '@/features/cart/CartContext';
import { formatCurrency } from '@/utils/format';

const paymentSchema = z.object({
  method: z.enum(['card', 'bkash', 'nagad']),
  name: z.string().min(2, 'Cardholder name is required'),
  cardNumber: z
    .string()
    .regex(/^\d{16}$/, 'Enter a 16-digit card number')
    .optional()
    .or(z.literal('')),
  phone: z.string().min(10, 'Enter a valid phone number'),
  address: z.string().min(8, 'Delivery address is required'),
});
type PaymentValues = z.infer<typeof paymentSchema>;

export function PaymentPage() {
  const { items, total, clear } = useCart();
  const navigate = useNavigate();
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentValues>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { method: 'card' },
  });
  const method = watch('method');
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 600));
    clear();
    void navigate(ROUTES.orderSuccess);
  };
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Secure Checkout</h1>
      <form
        onSubmit={(event) => void handleSubmit(submit)(event)}
        className="grid gap-8 lg:grid-cols-[1fr_22rem]"
      >
        <section className="space-y-7 rounded-2xl bg-white p-7 shadow-lg dark:bg-gray-800">
          <div>
            <h2 className="text-xl font-semibold">Payment Method</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {(['card', 'bkash', 'nagad'] as const).map((value) => (
                <label
                  key={value}
                  className="rounded-xl border p-4 text-center capitalize has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 dark:has-[:checked]:bg-primary-900"
                >
                  <input type="radio" value={value} className="mr-2" {...register('method')} />
                  {value}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="payment-name"
              label={method === 'card' ? 'Cardholder name' : 'Account name'}
              error={errors.name?.message}
              {...register('name')}
            />
            {method === 'card' && (
              <Field
                id="card-number"
                inputMode="numeric"
                maxLength={16}
                label="Card number"
                placeholder="1234567812345678"
                error={errors.cardNumber?.message}
                {...register('cardNumber')}
              />
            )}
            <Field
              id="payment-phone"
              label="Phone number"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <div className="sm:col-span-2">
              <TextareaField
                id="delivery-address"
                label="Delivery address"
                rows={3}
                error={errors.address?.message}
                {...register('address')}
              />
            </div>
          </div>
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" className="mt-1 rounded" />
            Save these details for future orders
          </label>
        </section>
        <aside className="h-fit rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="mt-5 space-y-4">
            {items.length ? (
              items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <img src={item.image} alt="" className="h-14 w-14 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      {item.quantity} × {formatCurrency(item.unitPrice)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Demo checkout order</p>
            )}
          </div>
          <dl className="mt-5 space-y-3 border-t pt-5 dark:border-gray-700">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd>{formatCurrency(total || 225)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Delivery</dt>
              <dd>{formatCurrency(50)}</dd>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <dt>Total</dt>
              <dd>{formatCurrency((total || 225) + 50)}</dd>
            </div>
          </dl>
          <Button type="submit" fullWidth size="lg" className="mt-6" isLoading={isSubmitting}>
            Complete Payment
          </Button>
          <p className="mt-3 text-center text-xs text-gray-500">
            Your payment information is encrypted and secure.
          </p>
        </aside>
      </form>
    </div>
  );
}

export function PaymentSuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl text-green-600">
        ✓
      </div>
      <h1 className="mt-6 text-4xl font-bold">Payment Successful!</h1>
      <p className="mt-3 text-gray-600 dark:text-gray-400">
        Thank you for supporting local farmers. Your order has been confirmed.
      </p>
      <div className="mt-10 rounded-2xl bg-white p-7 text-left shadow-lg dark:bg-gray-800">
        <h2 className="text-xl font-semibold">Order Confirmation</h2>
        <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-gray-500">Order number</dt>
            <dd className="font-medium">FB-2026-001234</dd>
          </div>
          <div>
            <dt className="text-gray-500">Transaction ID</dt>
            <dd className="font-medium">TXN-FB-20260727-001234</dd>
          </div>
          <div>
            <dt className="text-gray-500">Estimated delivery</dt>
            <dd className="font-medium">July 29, 2026</dd>
          </div>
          <div>
            <dt className="text-gray-500">Payment status</dt>
            <dd className="font-medium text-green-600">Paid</dd>
          </div>
        </dl>
      </div>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button asChild size="lg">
          <Link to={ROUTES.orders}>View My Orders</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to={ROUTES.home}>Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
