/// <reference lib="deno.unstable" />
import { Store, Category, Product } from "./schema.ts";

const kv = await Deno.openKv();

export const StoreDB = {
  async create(store: Omit<Store, "id">): Promise<Store> {
    const id = crypto.randomUUID();
    const newStore = { ...store, id };
    await kv.set(["stores", id], newStore);
    return newStore;
  },

  async get(id: string): Promise<Store | null> {
    const result = await kv.get<Store>(["stores", id]);
    return result.value;
  },

  async authenticate(id: string, password: string): Promise<boolean> {
    const store = await this.get(id);
    return store?.password === password;
  },

  async list(): Promise<Store[]> {
    const stores: Store[] = [];
    const entries = kv.list<Store>({ prefix: ["stores"] });
    for await (const entry of entries) {
      stores.push(entry.value);
    }
    return stores;
  },

  async delete(storeId: string): Promise<void> {
    await kv.delete(["stores", storeId]);
  },

  async update(id: string, updates: Partial<Omit<Store, "id">>): Promise<Store | null> {
    const store = await this.get(id);
    if (!store) return null;

    const updatedStore = { ...store, ...updates };
    await kv.set(["stores", id], updatedStore);
    return updatedStore;
  }
};

export const CategoryDB = {
  async create(category: Omit<Category, "id">): Promise<Category> {
    const id = crypto.randomUUID();
    const newCategory = { ...category, id };
    await kv.set(["categories", category.storeId, id], newCategory);
    return newCategory;
  },

  async listByStore(storeId: string): Promise<Category[]> {
    const categories: Category[] = [];
    const entries = kv.list<Category>({ prefix: ["categories", storeId] });
    for await (const entry of entries) {
      categories.push(entry.value);
    }
    return categories.sort((a, b) => a.order - b.order);
  },

  async delete(storeId: string, categoryId: string): Promise<void> {
    await kv.delete(["categories", storeId, categoryId]);
  }
};

export const ProductDB = {
  async create(product: Omit<Product, "id">): Promise<Product> {
    const id = crypto.randomUUID();
    const newProduct = { ...product, id };
    await kv.set(["products", product.storeId, id], newProduct);
    return newProduct;
  },

  async listByStore(storeId: string): Promise<Product[]> {
    const products: Product[] = [];
    const entries = kv.list<Product>({ prefix: ["products", storeId] });
    for await (const entry of entries) {
      if (entry.value.active) {
        products.push(entry.value);
      }
    }
    return products;
  },

  async listByCategory(storeId: string, categoryId: string): Promise<Product[]> {
    const products: Product[] = [];
    const entries = kv.list<Product>({ prefix: ["products", storeId] });
    for await (const entry of entries) {
      if (entry.value.categoryId === categoryId && entry.value.active) {
        products.push(entry.value);
      }
    }
    return products;
  },

  async delete(storeId: string, productId: string): Promise<void> {
    await kv.delete(["products", storeId, productId]);
  }
};
