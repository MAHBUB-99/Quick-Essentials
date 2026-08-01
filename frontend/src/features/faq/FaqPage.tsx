import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { BrandedPageBackground } from '@/components/layout/BrandedPageBackground';
import { ROUTES } from '@/constants/routes';

const FAQS = [
  {
    category: 'Ordering',
    question: 'How do I place an order?',
    answer:
      'Browse Products, open an item to review its details, choose a quantity, and select Add to Cart. When you are ready, open your cart and continue to checkout. You can also use Buy Now to proceed directly with a single product.',
  },
  {
    category: 'Ordering',
    question: 'Can I order a product through WhatsApp?',
    answer:
      'Yes. Open the product details page and select WhatsApp. A conversation with our support number will open with the product name, price, quantity, estimated total, and product link already prepared. Review the message before sending it.',
  },
  {
    category: 'Delivery',
    question: 'Where does QuickEssentials deliver?',
    answer:
      'Delivery availability depends on the product, seller, and destination. Enter your complete delivery address during checkout. If an area is outside the current delivery range, our team will contact you before confirming the order.',
  },
  {
    category: 'Delivery',
    question: 'How long will delivery take?',
    answer:
      'Most local orders are prepared and delivered within one to three business days. Fresh or harvest-dependent products may need additional preparation time. You can review progress from My Orders after checkout.',
  },
  {
    category: 'Payments',
    question: 'Which payment methods are accepted?',
    answer:
      'Available payment methods are shown securely at checkout. Depending on your order and location, these may include supported digital payment options or payment on delivery. Never send payment credentials through chat.',
  },
  {
    category: 'Products',
    question: 'How do you maintain product freshness and quality?',
    answer:
      'Products are listed with seller information, available stock, features, and current product details. Fresh items are prepared as close to delivery as possible, and packaging is selected to protect quality during transport.',
  },
  {
    category: 'Products',
    question: 'What does “Organic” mean on a product?',
    answer:
      'An Organic label indicates that the seller has listed the item as organically produced. Product descriptions provide additional details. If you need certification or farming-method information, contact us before placing the order.',
  },
  {
    category: 'Orders',
    question: 'Can I change or cancel an order?',
    answer:
      'Open My Orders and check the current status. Orders that have not entered preparation may still be changed or cancelled. Once packing or delivery has started, contact support immediately and we will confirm what is possible.',
  },
  {
    category: 'Returns',
    question: 'What should I do if an item arrives damaged or incorrect?',
    answer:
      'Take clear photos of the item and packaging, keep the product in its delivered condition, and contact support as soon as possible with your order number. We will review the issue and arrange the appropriate replacement, refund, or account credit.',
  },
  {
    category: 'Account',
    question: 'I cannot sign in. How can I recover my account?',
    answer:
      'Select Forgot password on the sign-in page and enter the phone number connected to your account. Follow the reset instructions you receive. If you no longer have access to that number, contact support for identity verification.',
  },
] as const;

export function FaqPage() {
  const [query, setQuery] = useState('');
  const normalizedQuery = query.trim().toLowerCase();
  const matchingFaqs = FAQS.filter(
    (faq) =>
      !normalizedQuery ||
      faq.question.toLowerCase().includes(normalizedQuery) ||
      faq.answer.toLowerCase().includes(normalizedQuery) ||
      faq.category.toLowerCase().includes(normalizedQuery),
  );

  return (
    <BrandedPageBackground>
      <div className="mx-auto max-w-5xl px-4 pb-14 pt-8 sm:px-6 sm:pt-12 lg:px-8">
        <header className="mx-auto max-w-3xl text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-200 bg-white/75 text-2xl text-primary-600 shadow-lg shadow-primary-900/10 backdrop-blur dark:border-emerald-800 dark:bg-gray-900/75 dark:text-primary-300">
            <Icon name="info" />
          </span>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">Frequently Asked Questions</h1>
          <p className="mx-auto mt-3 max-w-2xl leading-7 text-gray-600 dark:text-gray-300">
            Clear answers about shopping, delivery, payments, product quality, and account support.
          </p>
          <label className="relative mx-auto mt-6 block max-w-2xl">
            <span className="sr-only">Search frequently asked questions</span>
            <Icon name="search" className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-600" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search questions or topics..."
              className="h-12 w-full rounded-2xl border border-emerald-200 bg-white/85 pl-11 pr-4 text-gray-900 shadow-lg shadow-primary-900/5 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-emerald-900 dark:bg-gray-900/80 dark:text-white"
            />
          </label>
        </header>

        <section className="mt-9" aria-label="Frequently asked questions">
          <div className="mb-4 flex items-center justify-between gap-4">
            <h2 className="text-lg font-bold">Helpful answers</h2>
            <span className="text-sm text-gray-500" aria-live="polite">
              {matchingFaqs.length} {matchingFaqs.length === 1 ? 'answer' : 'answers'}
            </span>
          </div>
          {matchingFaqs.length > 0 ? (
            <div className="space-y-3">
              {matchingFaqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/80 shadow-sm backdrop-blur transition open:border-primary-400 open:shadow-lg open:shadow-primary-900/5 dark:border-emerald-900/70 dark:bg-gray-900/75 dark:open:border-primary-700"
                  open={index === 0 && !normalizedQuery}
                >
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-5 py-4 marker:hidden sm:px-6">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-sm font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="min-w-0 flex-1 text-left">
                      <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-primary-600 dark:text-primary-400">
                        {faq.category}
                      </span>
                      <span className="mt-0.5 block font-semibold sm:text-lg">{faq.question}</span>
                    </span>
                    <Icon name="chevronDown" className="text-sm text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-emerald-100 px-5 py-4 pl-[5rem] text-sm leading-7 text-gray-600 dark:border-gray-800 dark:text-gray-300 sm:px-6 sm:pl-[5.75rem]">
                    {faq.answer}
                  </div>
                </details>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-300 bg-white/60 px-6 py-12 text-center dark:border-emerald-800 dark:bg-gray-900/55">
              <Icon name="search" className="text-3xl text-gray-400" />
              <h2 className="mt-3 text-lg font-bold">No matching questions</h2>
              <p className="mt-1 text-sm text-gray-500">Try a shorter phrase or browse all answers.</p>
              <button type="button" onClick={() => setQuery('')} className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700">
                Clear search
              </button>
            </div>
          )}
        </section>

        <section className="mt-9 flex flex-col items-center justify-between gap-4 rounded-2xl bg-gradient-to-r from-primary-700 to-emerald-600 px-6 py-6 text-center text-white shadow-xl sm:flex-row sm:text-left">
          <div>
            <h2 className="text-xl font-bold">Still need help?</h2>
            <p className="mt-1 text-sm text-emerald-100">Review your orders or contact our support team.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-end">
            <Link to={ROUTES.support} className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 shadow-sm hover:bg-emerald-50">
              Contact Support
            </Link>
            <a
              href={`https://wa.me/8801832498239?text=${encodeURIComponent('Hello QuickEssentials Support, I need some help.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              <Icon name="whatsapp" /> WhatsApp
            </a>
          </div>
        </section>
      </div>
    </BrandedPageBackground>
  );
}
