import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Field, SelectField, TextareaField } from '@/components/forms/Field';
import { PageLoader } from '@/components/feedback/PageState';
import { ROUTES } from '@/constants/routes';
import { getProducts } from '@/services/api/marketplace';
import { formatCurrency } from '@/utils/format';

const listingSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  category: z.string().min(1, 'Choose a category'),
  description: z.string().min(20, 'Add at least 20 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  unit: z.string().min(1),
  stock: z.coerce.number().int().nonnegative(),
  location: z.string().min(3, 'Location is required'),
});
type ListingValues = z.infer<typeof listingSchema>;

export function CreateListingPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ListingValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: { unit: 'kg' },
  });
  const submit = async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 500));
  };
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link to={ROUTES.dashboardProducts}>My Listings</Link> / Add Product
      </nav>
      <h1 className="text-3xl font-bold">Add New Product</h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        List fresh produce for your customers.
      </p>
      <form
        onSubmit={(event) => void handleSubmit(submit)(event)}
        className="mt-8 space-y-8 rounded-2xl bg-white p-8 shadow-lg dark:bg-gray-800"
      >
        {isSubmitSuccessful && (
          <div className="rounded-lg bg-green-100 p-4 text-green-800" role="status">
            Product saved to the mock catalogue.
          </div>
        )}
        <section>
          <h2 className="mb-5 text-xl font-semibold">Basic Information</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              id="listing-name"
              label="Product name"
              error={errors.name?.message}
              {...register('name')}
            />
            <SelectField
              id="listing-category"
              label="Category"
              error={errors.category?.message}
              {...register('category')}
            >
              <option value="">Select category</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="grains">Grains</option>
              <option value="dairy">Dairy</option>
              <option value="honey">Honey</option>
            </SelectField>
            <div className="sm:col-span-2">
              <TextareaField
                id="listing-description"
                label="Description"
                rows={4}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
          </div>
        </section>
        <section className="border-t pt-7 dark:border-gray-700">
          <h2 className="mb-5 text-xl font-semibold">Pricing & Inventory</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field
              id="listing-price"
              type="number"
              step="0.01"
              label="Price (৳)"
              error={errors.price?.message}
              {...register('price')}
            />
            <SelectField
              id="listing-unit"
              label="Unit"
              error={errors.unit?.message}
              {...register('unit')}
            >
              <option value="kg">Kilogram</option>
              <option value="piece">Piece</option>
              <option value="liter">Liter</option>
              <option value="dozen">Dozen</option>
            </SelectField>
            <Field
              id="listing-stock"
              type="number"
              label="Available stock"
              error={errors.stock?.message}
              {...register('stock')}
            />
          </div>
        </section>
        <section className="border-t pt-7 dark:border-gray-700">
          <h2 className="mb-5 text-xl font-semibold">Product Images</h2>
          <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-10 text-center dark:border-gray-600">
            <Icon name="upload" className="text-3xl text-primary-600" />
            <span className="mt-3 font-medium">Upload product photos</span>
            <span className="text-sm text-gray-500">PNG or JPG, up to 5 files</span>
            <input type="file" accept="image/*" multiple className="sr-only" />
          </label>
        </section>
        <Field
          id="listing-location"
          label="Farm location"
          error={errors.location?.message}
          {...register('location')}
        />
        <fieldset>
          <legend className="mb-3 font-medium">Product Features</legend>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {['Organic', 'Pesticide Free', 'Fresh', 'Non-GMO', 'Quality Checked', 'Sustainable'].map(
              (feature) => (
                <label key={feature}>
                  <input type="checkbox" className="mr-2 rounded" />
                  {feature}
                </label>
              ),
            )}
          </div>
        </fieldset>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Reset
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            Publish Product
          </Button>
        </div>
      </form>
    </div>
  );
}

export function ManageListingsPage() {
  const products = useQuery({ queryKey: ['products', 'manage'], queryFn: () => getProducts() });
  if (products.isLoading) return <PageLoader label="Loading listings" />;
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Listings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update inventory, pricing, and availability.
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.dashboardProductNew}>
            <Icon name="plus" /> Add Product
          </Link>
        </Button>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <input
          placeholder="Search your listings"
          className="rounded-lg border bg-white px-4 py-2.5 dark:border-gray-600 dark:bg-gray-800"
        />
        <select className="rounded-lg border bg-white px-4 py-2.5 dark:border-gray-600 dark:bg-gray-800">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Out of stock</option>
        </select>
      </div>
      <section className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.data?.map((product) => (
          <article
            key={product.id}
            className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="aspect-[16/9] w-full object-cover"
            />
            <div className="p-5">
              <div className="flex justify-between gap-3">
                <h2 className="font-semibold">{product.name}</h2>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs capitalize text-green-800">
                  {product.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {formatCurrency(product.price)}/{product.unit} · {product.stock} in stock
              </p>
              <div className="mt-5 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Icon name="edit" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Icon name="eye" /> View
                </Button>
                <Button size="icon" variant="destructive" aria-label={`Delete ${product.name}`}>
                  <Icon name="trash" />
                </Button>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
