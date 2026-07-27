import { FarmerCard } from '@/components/cards/FarmerCard';
import { PageLoader } from '@/components/feedback/PageState';
import { getFarmers } from '@/services/api/marketplace';
import { useQuery } from '@tanstack/react-query';

export function FarmersPage() {
  const farmers = useQuery({ queryKey: ['farmers'], queryFn: getFarmers });
  return (
    <>
      <section className="bg-primary-600 px-4 py-8 text-center text-white">
        <h1 className="text-4xl font-bold">Meet Our Farmers</h1>
        <p className="mx-auto mt-4 max-w-2xl text-xl">
          The dedicated people growing fresh food for your family and community.
        </p>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Trusted Local Producers</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Every producer is verified before joining FarmFresh.
          </p>
        </div>
        {farmers.isLoading ? (
          <PageLoader />
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {farmers.data?.map((farmer) => (
              <FarmerCard key={farmer.id} farmer={farmer} />
            ))}
          </div>
        )}
      </section>
      <section className="bg-primary-600 px-4 py-16 text-center text-white">
        <h2 className="text-3xl font-bold">Are you a local farmer?</h2>
        <p className="mt-3 text-primary-100">
          Join our growing community and reach more customers.
        </p>
      </section>
    </>
  );
}
