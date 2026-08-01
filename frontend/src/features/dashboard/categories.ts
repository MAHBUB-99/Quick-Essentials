import { useState } from 'react';

export interface AdminCategory {
  id: string;
  name: string;
  slug: string;
}

const STORAGE_KEY = 'quickessentials-categories-v1';

const DEFAULT_CATEGORIES: AdminCategory[] = [
  { id: 'vegetables', name: 'Vegetables', slug: 'vegetables' },
  { id: 'fruits', name: 'Fruits', slug: 'fruits' },
  { id: 'grains', name: 'Grains', slug: 'grains' },
  { id: 'dairy', name: 'Dairy', slug: 'dairy' },
  { id: 'herbs', name: 'Herbs', slug: 'herbs' },
  { id: 'honey', name: 'Honey', slug: 'honey' },
];

function loadCategories() {
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_CATEGORIES;

  try {
    const categories = JSON.parse(saved) as AdminCategory[];
    return Array.isArray(categories) ? categories : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
}

function makeSlug(name: string) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function useCategories() {
  const [categories, setCategories] = useState<AdminCategory[]>(loadCategories);

  const save = (next: AdminCategory[]) => {
    setCategories(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const addCategory = (name: string) => {
    const slugBase = makeSlug(name) || 'category';
    let slug = slugBase;
    let suffix = 2;
    while (categories.some((category) => category.slug === slug)) {
      slug = `${slugBase}-${suffix}`;
      suffix += 1;
    }
    save([...categories, { id: crypto.randomUUID(), name: name.trim(), slug }]);
  };

  const updateCategory = (id: string, name: string) => {
    save(
      categories.map((category) =>
        category.id === id ? { ...category, name: name.trim() } : category,
      ),
    );
  };

  const deleteCategory = (id: string) => {
    save(categories.filter((category) => category.id !== id));
  };

  return { categories, addCategory, updateCategory, deleteCategory };
}
