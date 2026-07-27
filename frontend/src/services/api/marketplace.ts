import { MOCK_LATENCY_MS } from '@/constants/app';
import { mockFarmers, mockOrders, mockProducts } from '@/mocks/data';
import type { Farmer, Order, Product, ProductQuery } from '@/types';

const wait = () => new Promise<void>((resolve) => window.setTimeout(resolve, MOCK_LATENCY_MS));

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  // TODO(.NET API): replace with GET /api/products using the configured Axios client.
  await wait();
  const search = query.search?.trim().toLowerCase();
  return mockProducts.filter(
    (product) =>
      (!search ||
        product.name.toLowerCase().includes(search) ||
        product.farmName.toLowerCase().includes(search)) &&
      (!query.categories?.length || query.categories.includes(product.category)),
  );
}

export async function getProduct(id: string): Promise<Product | undefined> {
  // TODO(.NET API): replace with GET /api/products/{id}.
  await wait();
  return mockProducts.find((product) => product.id === id || product.slug === id);
}

export async function getFarmers(): Promise<Farmer[]> {
  // TODO(.NET API): replace with GET /api/farmers.
  await wait();
  return mockFarmers;
}

export async function getOrders(): Promise<Order[]> {
  // TODO(.NET API): replace with GET /api/orders/me.
  await wait();
  return mockOrders;
}
