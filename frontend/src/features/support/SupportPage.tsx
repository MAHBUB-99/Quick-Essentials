import type { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Field, SelectField, TextareaField } from '@/components/forms/Field';
import { BrandedPageBackground } from '@/components/layout/BrandedPageBackground';
import { ROUTES } from '@/constants/routes';

const WHATSAPP_SUPPORT_URL = `https://wa.me/8801832498239?text=${encodeURIComponent(
  'Hello QuickEssentials Support, I need help with an order or product.',
)}`;

const supportTopics = [
  ['cart', 'Order help', 'Track, change, or resolve an issue with an order.'],
  ['truck', 'Delivery support', 'Questions about delivery time, address, or coverage.'],
  ['shield', 'Payment support', 'Get help with checkout, charges, or payment status.'],
  ['leaf', 'Product support', 'Ask about quality, availability, or product details.'],
] as const;

export function SupportPage() {
  const submitRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const getField = (name: string) => {
      const value = data.get(name);
      return typeof value === 'string' ? value : '';
    };
    const topic = getField('topic') || 'General support';
    const message = [
      'Hello QuickEssentials Support, I need help.',
      '',
      `Name: ${getField('name')}`,
      `Phone number: ${getField('phone')}`,
      `Topic: ${topic}`,
      `Order number: ${getField('order') || 'Not provided'}`,
      '',
      'Support request:',
      getField('message'),
    ].join('\n');
    window.location.href = `https://wa.me/8801832498239?text=${encodeURIComponent(message)}`;
  };

  return (
    <BrandedPageBackground>
      <div className="mx-auto max-w-6xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white/75 text-2xl text-primary-600 shadow-lg shadow-primary-900/10 backdrop-blur dark:border-emerald-800 dark:bg-gray-900/75 dark:text-primary-300">
            <Icon name="handshake" />
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">How can we help?</h1>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600 dark:text-gray-300">
            Reach the QuickEssentials team for order, delivery, payment, product, or account help.
          </p>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Support topics">
          {supportTopics.map(([icon, title, description]) => (
            <article key={title} className="rounded-2xl border border-emerald-200/80 bg-white/75 p-4 shadow-sm backdrop-blur dark:border-emerald-900/70 dark:bg-gray-900/70">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                <Icon name={icon} />
              </span>
              <h2 className="mt-3 font-bold">{title}</h2>
              <p className="mt-1 text-sm leading-5 text-gray-500 dark:text-gray-400">{description}</p>
            </article>
          ))}
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <section className="rounded-3xl border border-emerald-200/80 bg-white/85 p-5 shadow-xl shadow-primary-900/10 backdrop-blur dark:border-emerald-900/70 dark:bg-gray-900/80 sm:p-7">
            <div>
              <h2 className="text-2xl font-bold">Send a support request</h2>
              <p className="mt-1 text-sm text-gray-500">
                Complete the form to open a prepared support message in WhatsApp.
              </p>
            </div>
            <form onSubmit={submitRequest} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field id="support-name" name="name" label="Your name" required autoComplete="name" />
                <Field id="support-phone" name="phone" label="Phone number" type="tel" required autoComplete="tel" placeholder="01XXXXXXXXX" />
                <SelectField id="support-topic" name="topic" label="Help topic" required defaultValue="">
                  <option value="" disabled>Select a topic</option>
                  <option value="order">Order help</option>
                  <option value="delivery">Delivery support</option>
                  <option value="payment">Payment support</option>
                  <option value="product">Product support</option>
                  <option value="account">Account help</option>
                </SelectField>
                <Field id="support-order" name="order" label="Order number (optional)" placeholder="For example: QE-1024" />
              </div>
              <TextareaField id="support-message" name="message" label="How can we help?" rows={5} required minLength={15} placeholder="Describe the issue and what you need help with..." />
              <Button type="submit" size="lg">
                <Icon name="paperPlane" /> Send Request
              </Button>
            </form>
          </section>

          <aside className="space-y-4">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#25D366] to-[#128C7E] p-6 text-white shadow-xl shadow-emerald-950/20">
              <Icon name="whatsapp" className="text-4xl" />
              <h2 className="mt-4 text-xl font-bold">Chat on WhatsApp</h2>
              <p className="mt-2 text-sm leading-6 text-white/85">Get direct help with products and orders through WhatsApp.</p>
              <a href={WHATSAPP_SUPPORT_URL} target="_blank" rel="noreferrer" className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#128C7E] shadow-sm hover:bg-emerald-50">
                <Icon name="whatsapp" /> Start a Chat
              </a>
            </div>

            <div className="rounded-2xl border border-emerald-200/80 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-emerald-900/70 dark:bg-gray-900/70">
              <h2 className="font-bold">Other helpful links</h2>
              <div className="mt-3 space-y-2 text-sm">
                <Link to={ROUTES.faq} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-emerald-50 hover:text-primary-700 dark:hover:bg-gray-800">
                  Browse FAQs <Icon name="chevronRight" />
                </Link>
                <Link to={ROUTES.orders} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-emerald-50 hover:text-primary-700 dark:hover:bg-gray-800">
                  View My Orders <Icon name="chevronRight" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </BrandedPageBackground>
  );
}
