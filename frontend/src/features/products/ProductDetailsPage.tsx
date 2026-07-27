import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
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
  if (product.isLoading) return <PageLoader label="Loading product" />;
  if (!product.data)
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-bold">Product not found</h1>
        <Link to={ROUTES.products} className="mt-4 inline-block text-primary-600">
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
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
        <Link to={ROUTES.home}>Home</Link> / <Link to={ROUTES.products}>Products</Link> /{' '}
        <span className="text-gray-900 dark:text-white">{item.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <img
            src={item.images[selectedImage]}
            alt={item.name}
            className="aspect-square w-full rounded-2xl object-cover shadow-lg"
          />
          <div className="mt-4 grid grid-cols-4 gap-3">
            {item.images.map((source, index) => (
              <button
                key={source}
                onClick={() => setSelectedImage(index)}
                className={`overflow-hidden rounded-lg border-2 ${selectedImage === index ? 'border-primary-500' : 'border-transparent'}`}
              >
                <img
                  src={source}
                  alt={`${item.name} view ${index + 1}`}
                  className="aspect-square object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="font-medium text-primary-600">{item.farmName}</p>
          <h1 className="mt-2 text-3xl font-bold">{item.name}</h1>
          <p className="mt-3 text-gray-600 dark:text-gray-400">
            <Icon name="star" className="text-yellow-400" /> {item.rating.average} (
            {item.rating.count} reviews) · <Icon name="mapMarker" /> {item.location}
          </p>
          <p className="mt-6 text-3xl font-bold text-primary-600">
            {formatCurrency(item.price)}{' '}
            <span className="text-base font-normal text-gray-500">/{item.unit}</span>
          </p>
          <p className="mt-6 leading-7 text-gray-600 dark:text-gray-300">{item.description}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {item.features.map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-primary-100 px-3 py-1 text-sm capitalize text-primary-800 dark:bg-primary-900 dark:text-primary-100"
              >
                {feature}
              </span>
            ))}
          </div>
          <div className="mt-8">
            <label className="mb-2 block text-sm font-medium">Quantity</label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="h-10 w-10 rounded-lg border dark:border-gray-600"
                aria-label="Decrease quantity"
              >
                <Icon name="minus" />
              </button>
              <output className="w-10 text-center">{quantity}</output>
              <button
                onClick={() => setQuantity((value) => Math.min(item.stock, value + 1))}
                className="h-10 w-10 rounded-lg border dark:border-gray-600"
                aria-label="Increase quantity"
              >
                <Icon name="plus" />
              </button>
              <span className="text-sm text-gray-500">{item.stock} available</span>
            </div>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={addToCart}>
              <Icon name="cart" /> Add to Cart
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to={ROUTES.payment}>Buy Now</Link>
            </Button>
          </div>
          <div className="mt-8 rounded-2xl bg-white p-5 shadow dark:bg-gray-800">
            <h2 className="font-semibold">Sold by {item.farmName}</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Verified local producer · Usually responds within one hour
            </p>
          </div>
        </div>
      </div>
      <section className="mt-16 border-t pt-10 dark:border-gray-700">
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
  );
}
