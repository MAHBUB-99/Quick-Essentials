import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { BrandedPageBackground } from '@/components/layout/BrandedPageBackground';
import { PageLoader } from '@/components/feedback/PageState';
import { ROUTES } from '@/constants/routes';
import { useCart } from '@/features/cart/CartContext';
import { getProduct } from '@/services/api/marketplace';
import { formatCurrency } from '@/utils/format';

const CUSTOMER_REVIEWS = [
  {
    id: 'review-1',
    author: 'Nusrat Jahan',
    rating: 5,
    date: 'July 28, 2026',
    comment: 'Excellent quality and very fresh. The packaging was careful and delivery was right on time.',
  },
  {
    id: 'review-2',
    author: 'Arif Rahman',
    rating: 5,
    date: 'July 24, 2026',
    comment: 'The product matched the photos and tasted great. I will definitely order this again.',
  },
  {
    id: 'review-3',
    author: 'Samira Khan',
    rating: 4,
    date: 'July 19, 2026',
    comment: 'Fresh and good value for money. Everything arrived in clean, secure packaging.',
  },
] as const;

export function ProductDetailsPage() {
  const { id = '' } = useParams();
  const product = useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id) });
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const { add } = useCart();
  const navigate = useNavigate();
  if (product.isLoading) return <PageLoader label="Loading product" />;
  if (!product.data)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link to={ROUTES.home} className="mt-4 inline-block text-primary-600">
          Back to products
        </Link>
      </div>
    );
  const item = product.data;
  const addToCart = () =>
    add({
      productId: item.id,
      name: item.name,
      image: item.images[0] ?? '',
      farmName: item.farmName,
      unitPrice: item.price,
      unit: item.unit,
      quantity,
      maxQuantity: item.stock,
    });
  const buyNow = () => {
    addToCart();
    void navigate(ROUTES.payment);
  };
  return (
    <BrandedPageBackground>
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <nav className="mb-3 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link to={ROUTES.home}>Products</Link> /{' '}
        <span className="text-gray-900 dark:text-white">{item.name}</span>
      </nav>
      <div className="relative isolate grid items-start gap-7 overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/80 p-3 shadow-xl shadow-primary-900/10 backdrop-blur-md dark:border-gray-700/70 dark:bg-gray-900/50 dark:shadow-primary-900/5 sm:p-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-emerald-100/75 dark:from-gray-900/10 dark:via-transparent dark:to-emerald-950/35" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-emerald-500/20 bg-emerald-300/20 dark:border-emerald-400/10 dark:bg-emerald-500/10" />
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-lime-500/20 dark:border-emerald-300/10" />
          <div className="absolute bottom-[-7rem] left-[38%] h-72 w-72 rounded-full bg-lime-300/25 blur-3xl dark:bg-emerald-600/10" />
          <svg
            viewBox="0 0 220 210"
            className="absolute -bottom-14 right-8 w-56 -rotate-6 text-emerald-700/[0.14] dark:text-emerald-300/[0.07] sm:w-64"
            fill="none"
          >
            <path
              d="M108 211C108 154 112 100 135 42"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path d="M130 69C82 69 57 46 58 10C104 9 131 31 130 69Z" fill="currentColor" />
            <path d="M116 121C70 120 43 98 41 62C87 60 115 81 116 121Z" fill="currentColor" />
            <path d="M124 105C170 102 196 80 199 45C155 41 127 63 124 105Z" fill="currentColor" />
          </svg>
        </div>
        <div className="relative z-10">
          <img
            src={item.images[selectedImage]}
            alt={item.name}
            className="aspect-[4/3] max-h-[30rem] w-full rounded-2xl object-cover shadow-lg"
          />
          <div className="mt-3 grid grid-cols-4 gap-2.5">
            {item.images.map((source, index) => (
              <button
                key={source}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-lg border-2 ${selectedImage === index ? 'border-primary-500' : 'border-transparent'}`}
              >
                <img
                  src={source}
                  alt={`${item.name} view ${index + 1}`}
                  className="aspect-[4/3] w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="relative z-10">
          <h1 className="mt-1 text-3xl font-bold">{item.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <button
              type="button"
              onClick={() => setReviewsOpen((open) => !open)}
              className="inline-flex items-center gap-1 rounded-md transition hover:text-primary-600 focus-visible:text-primary-600"
              aria-expanded={reviewsOpen}
              aria-controls="product-reviews"
            >
              <Icon name="star" className="text-yellow-400" />
              <span>{item.rating.average} ({item.rating.count} reviews)</span>
              <Icon name="chevronDown" className={`ml-1 text-[10px] transition-transform ${reviewsOpen ? 'rotate-180' : ''}`} />
            </button>
            <span aria-hidden>·</span>
            <span><Icon name="mapMarker" /> {item.location}</span>
          </div>
          <p className="mt-4 text-3xl font-bold text-primary-600">
            {formatCurrency(item.price)}{' '}
            <span className="text-base font-normal text-gray-500">/{item.unit}</span>
          </p>
          <div className="mt-5">
            <label className="mb-1.5 block text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="h-9 w-9 rounded-lg border border-emerald-200 bg-white/80 transition hover:border-primary-500 hover:bg-emerald-50 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-800"
                aria-label="Decrease quantity"
              >
                <Icon name="minus" />
              </button>
              <output className="w-10 text-center">{quantity}</output>
              <button
                onClick={() => setQuantity((value) => Math.min(item.stock, value + 1))}
                className="h-9 w-9 rounded-lg border border-emerald-200 bg-white/80 transition hover:border-primary-500 hover:bg-emerald-50 dark:border-gray-600 dark:bg-transparent dark:hover:bg-gray-800"
                aria-label="Increase quantity"
              >
                <Icon name="plus" />
              </button>
              <span className="text-sm text-gray-500">{item.stock} available</span>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Button onClick={addToCart}>
              <Icon name="cart" /> Add to Cart
            </Button>
            <Button variant="outline" onClick={buyNow}>
              Buy Now
            </Button>
          </div>
          <div className="mt-5 rounded-xl border border-emerald-200/80 bg-white/65 p-4 shadow-sm backdrop-blur-sm dark:border-emerald-900/60 dark:bg-gray-800/75 dark:shadow">
            <h2 className="font-semibold">Safe and reliable ordering</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              QuickEssentials helps you shop securely and receive your essentials with less hassle.
            </p>
          </div>
        </div>
        <section className="relative z-10 grid gap-5 border-t border-emerald-200/80 pt-5 dark:border-emerald-900/60 lg:col-span-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(18rem,0.7fr)] lg:items-start">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="h-5 w-1 rounded-full bg-primary-500" aria-hidden="true" />
              <h2 className="text-lg font-bold">About This Product</h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.12em] text-gray-500">
              Why you’ll love it
            </h3>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
              {item.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm font-medium capitalize">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-[9px] text-primary-700 dark:bg-primary-900 dark:text-primary-300">
                    <Icon name="check" />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      {reviewsOpen && (
        <section
          id="product-reviews"
          className="relative mt-5 overflow-hidden rounded-2xl border border-emerald-200/80 bg-white/80 p-5 shadow-lg shadow-primary-900/10 backdrop-blur dark:border-emerald-900/60 dark:bg-gray-900/70 sm:p-6"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl dark:bg-emerald-600/10" aria-hidden="true" />
          <div className="relative grid gap-6 lg:grid-cols-[15rem_1fr]">
            <div className="rounded-2xl bg-emerald-50/80 p-5 dark:bg-emerald-950/40">
              <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">Customer rating</p>
              <div className="mt-2 flex items-end gap-2">
                <strong className="text-4xl text-gray-900 dark:text-white">{item.rating.average}</strong>
                <span className="pb-1 text-sm text-gray-500">out of 5</span>
              </div>
              <div className="mt-2 flex gap-1" aria-label={`${item.rating.average} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Icon key={star} name={star <= Math.round(item.rating.average) ? 'star' : 'starRegular'} className="text-yellow-400" />
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-500">Based on {item.rating.count} verified reviews</p>
              <div className="mt-5 space-y-2">
                {[5, 4, 3, 2, 1].map((rating, index) => {
                  const widths = ['78%', '16%', '4%', '1%', '1%'];
                  return (
                    <div key={rating} className="grid grid-cols-[1rem_1fr_2rem] items-center gap-2 text-xs text-gray-500">
                      <span>{rating}</span>
                      <span className="h-1.5 overflow-hidden rounded-full bg-emerald-100 dark:bg-gray-700">
                        <span className="block h-full rounded-full bg-yellow-400" style={{ width: widths[index] }} />
                      </span>
                      <span>{widths[index]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Customer Reviews</h2>
                  <p className="mt-1 text-sm text-gray-500">Recent feedback from verified buyers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewsOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 text-gray-500 hover:bg-emerald-50 hover:text-primary-600 dark:border-gray-700 dark:hover:bg-gray-800"
                  aria-label="Close reviews"
                >
                  <Icon name="times" />
                </button>
              </div>
              <div className="mt-4 divide-y divide-emerald-100 dark:divide-gray-700">
                {CUSTOMER_REVIEWS.map((review) => (
                  <article key={review.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 font-bold text-primary-700 dark:bg-primary-900 dark:text-primary-200">
                        {review.author.split(' ').map((part) => part[0]).join('')}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <h3 className="font-semibold">{review.author}</h3>
                            <div className="mt-0.5 flex gap-0.5" aria-label={`${review.rating} out of 5 stars`}>
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Icon key={star} name={star <= review.rating ? 'star' : 'starRegular'} className="text-xs text-yellow-400" />
                              ))}
                            </div>
                          </div>
                          <time className="text-xs text-gray-500">{review.date}</time>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-gray-600 dark:text-gray-300">{review.comment}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
      </div>
    </BrandedPageBackground>
  );
}
