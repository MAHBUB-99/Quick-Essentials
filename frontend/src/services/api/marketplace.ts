import { MOCK_LATENCY_MS } from '@/constants/app';
import { mockFarmers, mockOrders, mockProducts } from '@/mocks/data';
import type { Farmer, Order, Product, ProductQuery } from '@/types';

const wait = () => new Promise<void>((resolve) => window.setTimeout(resolve, MOCK_LATENCY_MS));
const PRODUCTS_KEY = 'quickessentials-products-v1';

function readProducts(): Product[] {
  const saved = window.localStorage.getItem(PRODUCTS_KEY);
  if (!saved) return mockProducts;
  try {
    const products = JSON.parse(saved) as Product[];
    return Array.isArray(products) ? products : mockProducts;
  } catch {
    return mockProducts;
  }
}

function writeProducts(products: Product[]) {
  window.localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function filterProducts(products: Product[], query: ProductQuery) {
  const search = query.search?.trim().toLowerCase();
  const filtered = products.filter(
    (product) =>
      (!search ||
        product.name.toLowerCase().includes(search) ||
        product.farmName.toLowerCase().includes(search)) &&
      (!query.categories?.length || query.categories.includes(product.category)) &&
      (query.priceMin === undefined || product.price >= query.priceMin) &&
      (query.priceMax === undefined || product.price <= query.priceMax) &&
      (!query.location ||
        product.location.toLowerCase().includes(query.location.trim().toLowerCase())) &&
      (!query.organicOnly || product.features.includes('organic')),
  );

  return [...filtered].sort((a, b) => {
    switch (query.sort) {
      case 'price-asc': return a.price - b.price;
      case 'price-desc': return b.price - a.price;
      case 'newest': return Date.parse(b.createdAt) - Date.parse(a.createdAt);
      case 'rating': return b.rating.average - a.rating.average || b.rating.count - a.rating.count;
      case 'featured':
      default:
        return b.purchaseCount - a.purchaseCount || Date.parse(b.createdAt) - Date.parse(a.createdAt);
    }
  });
}

export async function getProducts(query: ProductQuery = {}): Promise<Product[]> {
  // TODO(.NET API): replace with GET /api/products using the configured Axios client.
  await wait();
  return filterProducts(readProducts().filter((product) => product.status === 'active'), query);
}

export async function getAdminProducts(query: ProductQuery = {}): Promise<Product[]> {
  await wait();
  return filterProducts(readProducts(), query);
}

export async function getProduct(id: string): Promise<Product | undefined> {
  // TODO(.NET API): replace with GET /api/products/{id}.
  await wait();
  return readProducts().find(
    (product) => product.status === 'active' && (product.id === id || product.slug === id),
  );
}

export async function getAdminProduct(id: string): Promise<Product | undefined> {
  await wait();
  return readProducts().find((product) => product.id === id || product.slug === id);
}

export async function updateProduct(id: string, changes: Partial<Product>): Promise<Product> {
  await wait();
  const products = readProducts();
  const index = products.findIndex((product) => product.id === id);
  if (index < 0) throw new Error('Product not found');
  const updated = { ...products[index], ...changes } as Product;
  products[index] = updated;
  writeProducts(products);
  return updated;
}

export async function deleteProduct(id: string): Promise<void> {
  await wait();
  writeProducts(readProducts().filter((product) => product.id !== id));
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
