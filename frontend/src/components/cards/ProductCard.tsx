import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { ROUTES } from '@/constants/routes';
import { useCart } from '@/features/cart/CartContext';
import type { Product } from '@/types';
import { formatCurrency } from '@/utils/format';

export const ProductCard = memo(function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const addToCart = () =>
    add({
      productId: product.id,
      name: product.name,
      image: product.images[0] ?? '',
      farmName: product.farmName,
      unitPrice: product.price,
      unit: product.unit,
      quantity: 1,
      maxQuantity: product.stock,
    });
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
      <Link
        to={ROUTES.productDetails(product.id)}
        className="relative block aspect-[4/3] overflow-hidden"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          loading="lazy"
        />
        {product.features.includes('organic') && (
          <span className="absolute left-3 top-3 rounded-full bg-primary-600 px-3 py-1 text-xs font-medium text-white">
            Organic
          </span>
        )}
      </Link>
      <div className="p-5">
        <p className="dark:text-primary-400 mb-1 text-sm text-primary-600">{product.farmName}</p>
        <Link to={ROUTES.productDetails(product.id)}>
          <h2 className="text-lg font-semibold text-gray-900 hover:text-primary-600 dark:text-white">
            {product.name}
          </h2>
        </Link>
        <p className="mt-2 flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
          <Icon name="star" className="text-yellow-400" /> {product.rating.average} (
          {product.rating.count})
        </p>
        <div className="mt-4 flex items-center justify-between">
          <p>
            <span className="text-xl font-bold text-primary-600">
              {formatCurrency(product.price)}
            </span>
            <span className="text-sm text-gray-500">/{product.unit}</span>
          </p>
          <Button size="icon" onClick={addToCart} aria-label={`Add ${product.name} to cart`}>
            <Icon name="cart" />
          </Button>
        </div>
      </div>
    </article>
  );
});
