import { Icon } from '@/components/common/Icon';

export function PageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="mx-auto flex min-h-64 max-w-7xl items-center justify-center p-8" role="status">
      <Icon name="seedling" spin className="mr-3 text-2xl text-primary-600" />
      <span>{label}…</span>
    </div>
  );
}

export function EmptyState({ title, message }: { title: string; message: string }) {
  return (
    <div className="rounded-2xl bg-white p-12 text-center shadow-lg dark:bg-gray-800">
      <Icon name="boxOpen" className="mb-4 text-5xl text-gray-400" />
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}
