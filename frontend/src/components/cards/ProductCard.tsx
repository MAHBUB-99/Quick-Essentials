import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { ROUTES } from '@/constants/routes';
import { useCart } from '@/features/cart/CartContext';
import type { Product } from '@/types';
import { cn } from '@/utils/cn';
import { formatCurrency } from '@/utils/format';

export const ProductCard = memo(function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
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
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden bg-gradient-to-br from-white via-emerald-50/70 to-lime-100/60 shadow-md transition hover:-translate-y-1 hover:shadow-xl dark:from-gray-800 dark:via-gray-800 dark:to-emerald-950/55',
        compact ? 'rounded-xl' : 'rounded-2xl',
      )}
    >
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
          <span
            className={cn(
              'absolute rounded-full bg-primary-600 font-medium text-white',
              compact ? 'left-2 top-2 px-2 py-0.5 text-[10px]' : 'left-3 top-3 px-3 py-1 text-xs',
            )}
          >
            Organic
          </span>
        )}
      </Link>
      <div
        className={
          compact
            ? 'relative flex flex-1 flex-col overflow-hidden p-2.5 sm:p-3'
            : 'relative overflow-hidden p-5'
        }
      >
        <span
          className="pointer-events-none absolute -bottom-10 -right-9 h-24 w-24 rounded-full border border-primary-500/10 bg-primary-100/25 dark:border-emerald-400/10 dark:bg-emerald-900/10"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute -bottom-5 -right-3 h-14 w-14 rounded-full border border-primary-500/10 dark:border-emerald-400/10"
          aria-hidden="true"
        />
        <Icon
          name="leaf"
          className="pointer-events-none absolute right-3 top-2 text-2xl text-primary-600/[0.07] dark:text-emerald-400/[0.08]"
          aria-hidden
        />
        <Link to={ROUTES.productDetails(product.id)} className="relative z-10">
          <h2
            className={cn(
              'font-semibold text-gray-900 hover:text-primary-600 dark:text-white',
              compact ? 'line-clamp-2 min-h-10 text-sm leading-5' : 'text-lg',
            )}
          >
            {product.name}
          </h2>
        </Link>
        <p
          className={cn(
            'relative z-10 flex items-center gap-1 text-gray-600 dark:text-gray-400',
            compact ? 'mt-1.5 text-xs' : 'mt-2 text-sm',
          )}
        >
          <Icon name="star" className="text-yellow-400" /> {product.rating.average} (
          {product.rating.count})
        </p>
        <div
          className={cn(
            'relative z-10 flex items-center justify-between',
            compact ? 'mt-auto pt-2' : 'mt-4',
          )}
        >
          <p>
            <span className={cn('font-bold text-primary-600', compact ? 'text-lg' : 'text-xl')}>
              {formatCurrency(product.price)}
            </span>
            <span className={cn('text-gray-500', compact ? 'text-xs' : 'text-sm')}>
              /{product.unit}
            </span>
          </p>
          <Button
            size="icon"
            className={compact ? 'h-8 w-8 shrink-0 sm:h-9 sm:w-9' : undefined}
            onClick={addToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <Icon name="cart" />
          </Button>
        </div>
      </div>
    </article>
  );
});
