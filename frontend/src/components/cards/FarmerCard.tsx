import { memo } from 'react';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import type { Farmer } from '@/types';

export const FarmerCard = memo(function FarmerCard({ farmer }: { farmer: Farmer }) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl dark:bg-gray-800">
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 p-6 text-center">
        <img
          src={farmer.avatar}
          alt=""
          className="mx-auto h-24 w-24 rounded-full border-4 border-white object-cover"
          loading="lazy"
        />
      </div>
      <div className="p-6 text-center">
        <h2 className="text-xl font-semibold">
          {farmer.name}{' '}
          {farmer.certified && (
            <Icon name="certificate" className="text-primary-500" aria-label="Certified" />
          )}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          <Icon name="mapMarker" /> {farmer.location}
        </p>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">{farmer.description}</p>
        <div className="mt-4 flex justify-center gap-2">
          {farmer.specialties.map((item) => (
            <span
              key={item.label}
              className="rounded-full bg-primary-100 px-3 py-1 text-xs text-primary-800 dark:bg-primary-900 dark:text-primary-100"
            >
              {item.label}
            </span>
          ))}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 border-y py-4 text-sm dark:border-gray-700">
          <span>
            <b className="block">{farmer.rating}</b>Rating
          </span>
          <span>
            <b className="block">{farmer.productCount}</b>Products
          </span>
          <span>
            <b className="block">{farmer.since}</b>Since
          </span>
        </div>
        <Button className="mt-5" fullWidth>
          View Products
        </Button>
      </div>
    </article>
  );
});
