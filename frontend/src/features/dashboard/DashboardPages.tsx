import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '@/components/common/Button';
import { Icon } from '@/components/common/Icon';
import { Field, SelectField, TextareaField } from '@/components/forms/Field';
import { PageLoader } from '@/components/feedback/PageState';
import { ROUTES } from '@/constants/routes';
import {
  deleteProduct,
  getAdminProduct,
  getAdminProducts,
  updateProduct,
} from '@/services/api/marketplace';
import type { CategorySlug, Product, ProductFeature, ProductUnit } from '@/types';
import { formatCurrency } from '@/utils/format';
import { useCategories } from './categories';

const listingSchema = z.object({
  name: z.string().min(3, 'Product name is required'),
  category: z.string().min(1, 'Choose a category'),
  description: z.string().min(20, 'Add at least 20 characters'),
  price: z.coerce.number().positive('Price must be positive'),
  unit: z.string().min(1),
  stock: z.coerce.number().int().nonnegative(),
});
type ListingValues = z.infer<typeof listingSchema>;

export function CreateListingPage() {
  const { categories } = useCategories();
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
    <div className="mx-auto w-full max-w-4xl px-4 py-6 sm:py-8">
      <nav className="mb-3 text-sm text-gray-500">
        <Link to={ROUTES.dashboardProducts}>My Listings</Link> / Add Product
      </nav>
      <h1 className="text-2xl font-bold sm:text-3xl">Add New Product</h1>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
        List fresh produce for your customers.
      </p>
      <form
        onSubmit={(event) => void handleSubmit(submit)(event)}
        className="mt-5 space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6"
      >
        {isSubmitSuccessful && (
          <div className="rounded-lg bg-green-100 p-4 text-green-800" role="status">
            Product saved to the mock catalogue.
          </div>
        )}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
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
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </SelectField>
            <div className="sm:col-span-2">
              <TextareaField
                id="listing-description"
                label="Description"
                rows={3}
                error={errors.description?.message}
                {...register('description')}
              />
            </div>
          </div>
        </section>
        <section className="border-t pt-5 dark:border-gray-700">
          <h2 className="mb-4 text-lg font-semibold">Pricing & Inventory</h2>
          <div className="grid gap-4 sm:grid-cols-3">
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
        <section className="border-t pt-5 dark:border-gray-700">
          <h2 className="mb-4 text-lg font-semibold">Product Images</h2>
          <label className="flex cursor-pointer flex-col items-center rounded-xl border-2 border-dashed border-gray-300 p-6 text-center transition hover:border-primary-500 hover:bg-primary-50/40 dark:border-gray-600 dark:hover:bg-gray-700/40">
            <Icon name="upload" className="text-2xl text-primary-600" />
            <span className="mt-2 font-medium">Upload product photos</span>
            <span className="text-sm text-gray-500">PNG or JPG, up to 5 files</span>
            <input type="file" accept="image/*" multiple className="sr-only" />
          </label>
        </section>
        <fieldset className="border-t pt-5 dark:border-gray-700">
          <legend className="mb-2 font-medium">Product Features</legend>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3">
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

const editListingSchema = listingSchema.extend({
  image: z.string().url('Enter a valid image URL'),
  status: z.enum(['active', 'inactive', 'out-of-stock']),
  features: z.array(z.string()),
});
type EditListingValues = z.infer<typeof editListingSchema>;

const PRODUCT_FEATURES = [
  ['organic', 'Organic'],
  ['pesticide-free', 'Pesticide Free'],
  ['fresh', 'Fresh'],
  ['non-gmo', 'Non-GMO'],
  ['sustainable', 'Sustainable'],
  ['fair-trade', 'Fair Trade'],
  ['gluten-free', 'Gluten Free'],
] as const;

function EditListingForm({ product }: { product: Product }) {
  const { categories } = useCategories();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditListingValues>({
    resolver: zodResolver(editListingSchema),
    defaultValues: {
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      unit: product.unit,
      stock: product.stock,
      image: product.images[0] ?? '',
      status: product.status,
      features: product.features,
    },
  });
  const mutation = useMutation({
    mutationFn: (values: EditListingValues) =>
      updateProduct(product.id, {
        name: values.name,
        category: values.category as CategorySlug,
        description: values.description,
        price: values.price,
        unit: values.unit as ProductUnit,
        stock: values.stock,
        images: [values.image, ...product.images.slice(1).filter((image) => image !== values.image)],
        status: values.status,
        features: values.features as ProductFeature[],
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['products'] });
      await queryClient.invalidateQueries({ queryKey: ['product', product.id] });
      await navigate(ROUTES.dashboardProducts, { replace: true });
    },
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-6">
      <nav className="mb-3 text-sm text-gray-500">
        <Link to={ROUTES.dashboardProducts}>My Listings</Link> / Edit Product
      </nav>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">Edit Product</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">Update every part of this listing.</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm capitalize ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
          {product.status.replaceAll('-', ' ')}
        </span>
      </div>
      <form
        onSubmit={(event) => void handleSubmit((values) => mutation.mutate(values))(event)}
        className="mt-5 space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-lg dark:border-gray-700 dark:bg-gray-800 sm:p-6"
      >
        {mutation.isError && (
          <p className="rounded-lg bg-red-100 p-3 text-sm text-red-800" role="alert">
            The product could not be saved. Please try again.
          </p>
        )}
        <section>
          <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="edit-name" label="Product name" error={errors.name?.message} {...register('name')} />
            <SelectField id="edit-category" label="Category" error={errors.category?.message} {...register('category')}>
              {categories.map((category) => (
                <option key={category.id} value={category.slug}>{category.name}</option>
              ))}
            </SelectField>
            <div className="sm:col-span-2">
              <TextareaField id="edit-description" label="Description" rows={3} error={errors.description?.message} {...register('description')} />
            </div>
          </div>
        </section>
        <section className="border-t pt-5 dark:border-gray-700">
          <h2 className="mb-4 text-lg font-semibold">Pricing, Inventory & Visibility</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Field id="edit-price" type="number" step="0.01" label="Price (৳)" error={errors.price?.message} {...register('price')} />
            <SelectField id="edit-unit" label="Unit" error={errors.unit?.message} {...register('unit')}>
              <option value="kg">Kilogram</option><option value="lbs">Pound</option><option value="piece">Piece</option>
              <option value="liter">Liter</option><option value="dozen">Dozen</option><option value="bundle">Bundle</option>
            </SelectField>
            <Field id="edit-stock" type="number" label="Available stock" error={errors.stock?.message} {...register('stock')} />
            <SelectField id="edit-status" label="Visibility" error={errors.status?.message} {...register('status')}>
              <option value="active">Visible</option><option value="inactive">Hidden</option><option value="out-of-stock">Out of stock</option>
            </SelectField>
          </div>
        </section>
        <section className="border-t pt-5 dark:border-gray-700">
          <h2 className="mb-4 text-lg font-semibold">Product Image</h2>
          <div className="grid items-end gap-4 sm:grid-cols-[8rem_1fr]">
            <img src={product.images[0]} alt="Current product" className="aspect-square w-32 rounded-xl object-cover" />
            <Field id="edit-image" type="url" label="Primary image URL" error={errors.image?.message} {...register('image')} />
          </div>
        </section>
        <fieldset className="border-t pt-5 dark:border-gray-700">
          <legend className="mb-3 font-medium">Product Features</legend>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {PRODUCT_FEATURES.map(([value, label]) => (
              <label key={value} className="rounded-lg border border-gray-200 px-3 py-2 text-sm dark:border-gray-700">
                <input type="checkbox" value={value} className="mr-2 rounded" {...register('features')} />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="flex justify-end gap-3 border-t pt-5 dark:border-gray-700">
          <Button type="button" variant="outline" onClick={() => void navigate(ROUTES.dashboardProducts)}>Cancel</Button>
          <Button type="submit" isLoading={mutation.isPending}><Icon name="check" /> Save Changes</Button>
        </div>
      </form>
    </div>
  );
}

export function EditListingPage() {
  const { id = '' } = useParams();
  const product = useQuery({ queryKey: ['products', 'admin', id], queryFn: () => getAdminProduct(id) });
  if (product.isLoading) return <PageLoader label="Loading product" />;
  if (!product.data) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Button asChild variant="outline" className="mt-5"><Link to={ROUTES.dashboardProducts}>Back to Listings</Link></Button>
      </div>
    );
  }
  return <EditListingForm product={product.data} />;
}

export function ManageListingsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [notice, setNotice] = useState('');
  const queryClient = useQueryClient();
  const products = useQuery({
    queryKey: ['products', 'manage'],
    queryFn: () => getAdminProducts(),
  });
  const refreshProducts = async () => {
    await queryClient.invalidateQueries({ queryKey: ['products'] });
  };
  const visibilityMutation = useMutation({
    mutationFn: ({ id, status }: Pick<Product, 'id' | 'status'>) => updateProduct(id, { status }),
    onSuccess: async (product) => {
      setNotice(`${product.name} is now ${product.status === 'active' ? 'visible' : 'hidden'}.`);
      await refreshProducts();
    },
  });
  const deleteMutation = useMutation({
    mutationFn: ({ id }: Pick<Product, 'id' | 'name'>) => deleteProduct(id),
    onSuccess: async (_, product) => {
      setNotice(`${product.name} was deleted successfully.`);
      await refreshProducts();
    },
  });
  if (products.isLoading) return <PageLoader label="Loading listings" />;

  const normalizedSearch = search.trim().toLowerCase();
  const filteredProducts = (products.data ?? []).filter((product) => {
    const matchesSearch =
      !normalizedSearch ||
      product.name.toLowerCase().includes(normalizedSearch) ||
      product.category.toLowerCase().includes(normalizedSearch);
    const matchesStatus = status === 'all' || product.status === status;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-5 sm:py-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Manage Listings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Update inventory, pricing, and availability.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="outline">
            <Link to={ROUTES.dashboardCategories}>Manage Categories</Link>
          </Button>
          <Button asChild>
            <Link to={ROUTES.dashboardProductNew}>
              <Icon name="plus" /> Add Product
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search your listings"
          aria-label="Search listings"
          className="rounded-lg border bg-white px-4 py-2.5 dark:border-gray-600 dark:bg-gray-800"
        />
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          aria-label="Filter listings by status"
          className="rounded-lg border bg-white px-4 py-2.5 dark:border-gray-600 dark:bg-gray-800"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
      </div>
      {notice && (
        <div className="mt-4 flex items-center justify-between rounded-lg bg-green-100 px-4 py-3 text-sm text-green-800" role="status">
          <span>{notice}</span>
          <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">
            <Icon name="times" />
          </button>
        </div>
      )}
      <p className="mt-4 h-5 text-sm tabular-nums text-gray-500" aria-live="polite">
        Showing {filteredProducts.length} of {products.data?.length ?? 0} listings
      </p>
      <section className="mt-4 grid min-h-[28rem] content-start gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <article
            key={product.id}
            className="w-full max-w-[26rem] justify-self-start overflow-hidden rounded-xl bg-white shadow-lg dark:bg-gray-800"
          >
            <img
              src={product.images[0]}
              alt={product.name}
              className="aspect-[2/1] w-full object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between gap-3">
                <h2 className="font-semibold">{product.name}</h2>
                <span className={`rounded-full px-2 py-1 text-xs capitalize ${product.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-700'}`}>
                  {product.status.replaceAll('-', ' ')}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                {formatCurrency(product.price)}/{product.unit} · {product.stock} in stock
              </p>
              <div className="mt-4 flex gap-2">
                <Button asChild size="sm" variant="outline" className="flex-1">
                  <Link to={ROUTES.dashboardProductEdit(product.id)}>
                    <Icon name="edit" /> Edit
                  </Link>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={visibilityMutation.isPending}
                  onClick={() =>
                    visibilityMutation.mutate({
                      id: product.id,
                      status: product.status === 'active' ? 'inactive' : 'active',
                    })
                  }
                  aria-label={`${product.status === 'active' ? 'Hide' : 'Show'} ${product.name}`}
                >
                  <Icon name={product.status === 'active' ? 'eye' : 'eyeSlash'} />
                  {product.status === 'active' ? 'Hide' : 'Show'}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  disabled={deleteMutation.isPending}
                  aria-label={`Delete ${product.name}`}
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete “${product.name}”?`)) {
                      deleteMutation.mutate({ id: product.id, name: product.name });
                    }
                  }}
                >
                  <Icon name="trash" />
                </Button>
              </div>
            </div>
          </article>
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full flex min-h-[28rem] items-center justify-center rounded-2xl border border-dashed border-gray-300 px-6 text-center dark:border-gray-700">
            <div>
              <Icon name="search" className="text-2xl text-gray-400" />
              <h2 className="mt-3 font-semibold">No matching listings</h2>
              <p className="mt-1 text-sm text-gray-500">
                Try another search term or choose a different status.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                  setSearch('');
                  setStatus('all');
                }}
              >
                Clear filters
              </Button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export function ManageCategoriesPage() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const submitNewCategory = (event: FormEvent) => {
    event.preventDefault();
    if (!newName.trim()) return;
    addCategory(newName);
    setNewName('');
  };

  const startEditing = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const saveEdit = (event: FormEvent) => {
    event.preventDefault();
    if (!editingId || !editingName.trim()) return;
    updateCategory(editingId, editingName);
    setEditingId(null);
    setEditingName('');
  };

  const removeCategory = (id: string, name: string) => {
    if (window.confirm(`Delete the “${name}” category?`)) deleteCategory(id);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12">
      <nav className="mb-6 text-sm text-gray-500">
        <Link to={ROUTES.dashboardProducts}>Admin Dashboard</Link> / Categories
      </nav>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-3xl font-bold">Product Categories</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create, rename, and remove the categories available when adding products.
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={ROUTES.dashboardProducts}>Back to Products</Link>
        </Button>
      </div>

      <form
        onSubmit={submitNewCategory}
        className="mt-8 flex flex-col gap-3 rounded-2xl bg-white p-6 shadow-lg dark:bg-gray-800 sm:flex-row sm:items-end"
      >
        <div className="flex-1">
          <Field
            id="new-category-name"
            label="New category name"
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            placeholder="For example: Bakery"
            maxLength={50}
          />
        </div>
        <Button type="submit" disabled={!newName.trim()}>
          <Icon name="plus" /> Add Category
        </Button>
      </form>

      <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800">
        <div className="border-b px-6 py-4 dark:border-gray-700">
          <h2 className="font-semibold">All Categories ({categories.length})</h2>
        </div>
        {categories.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No categories yet. Add the first one above.</p>
        ) : (
          <ul className="divide-y dark:divide-gray-700">
            {categories.map((category) => (
              <li key={category.id} className="flex flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center">
                {editingId === category.id ? (
                  <form onSubmit={saveEdit} className="flex flex-1 flex-col gap-3 sm:flex-row">
                    <label className="sr-only" htmlFor={`edit-category-${category.id}`}>
                      Category name
                    </label>
                    <input
                      id={`edit-category-${category.id}`}
                      value={editingName}
                      onChange={(event) => setEditingName(event.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-700"
                      maxLength={50}
                      autoFocus
                    />
                    <Button type="submit" size="sm" disabled={!editingName.trim()}>
                      Save
                    </Button>
                    <Button type="button" size="sm" variant="outline" onClick={() => setEditingId(null)}>
                      Cancel
                    </Button>
                  </form>
                ) : (
                  <>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{category.name}</p>
                      <p className="mt-1 text-sm text-gray-500">/{category.slug}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => startEditing(category.id, category.name)}
                      >
                        <Icon name="edit" /> Edit
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeCategory(category.id, category.name)}
                      >
                        <Icon name="trash" /> Delete
                      </Button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
