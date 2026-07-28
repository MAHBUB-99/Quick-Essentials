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

export function ProductDetailsPage() {
  const { id = '' } = useParams();
  const product = useQuery({ queryKey: ['product', id], queryFn: () => getProduct(id) });
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
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
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            <Icon name="star" className="text-yellow-400" /> {item.rating.average} (
            {item.rating.count} reviews) · <Icon name="mapMarker" /> {item.location}
          </p>
          <p className="mt-4 text-3xl font-bold text-primary-600">
            {formatCurrency(item.price)}{' '}
            <span className="text-base font-normal text-gray-500">/{item.unit}</span>
          </p>
          <p className="mt-4 max-w-2xl leading-6 text-gray-600 dark:text-gray-300">
            {item.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {item.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-primary-100 px-2.5 py-1 text-xs capitalize text-primary-800 dark:bg-primary-900 dark:text-primary-100"
              >
                {feature}
              </span>
            ))}
          </div>
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
      </div>
      <section className="mt-12 border-t pt-8 dark:border-gray-700">
        <h2 className="text-2xl font-bold">About This Product</h2>
        <div className="prose-farm mt-5 max-w-3xl">
          <p>{item.description}</p>
          <h3>Why you’ll love it</h3>
          <ul>
            {item.features.map((feature) => (
              <li key={feature} className="capitalize">
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </section>
      </div>
    </BrandedPageBackground>
  );
}
