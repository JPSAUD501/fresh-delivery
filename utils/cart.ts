// utils/cart.ts
import { CartItem } from "../db/schema.ts";

export const CartStorage = {
  getKey(storeId: string) {
    return `cart_${storeId}`;
  },

  getItems(storeId: string): CartItem[] {
    const key = this.getKey(storeId);
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : [];
  },

  addItem(storeId: string, item: CartItem) {
    const items = this.getItems(storeId);
    const existingIndex = items.findIndex(i => i.productId === item.productId);
    
    if (existingIndex >= 0) {
      items[existingIndex].quantity += item.quantity;
    } else {
      items.push(item);
    }

    localStorage.setItem(this.getKey(storeId), JSON.stringify(items));
  },

  removeItem(storeId: string, productId: string) {
    const items = this.getItems(storeId);
    const filtered = items.filter(i => i.productId !== productId);
    localStorage.setItem(this.getKey(storeId), JSON.stringify(filtered));
  },

  clear(storeId: string) {
    localStorage.removeItem(this.getKey(storeId));
  }
};

// utils/auth.ts
export const AdminAuth = {
  KEY_PREFIX: "admin_auth_",

  setAuthenticated(storeId: string) {
    sessionStorage.setItem(this.KEY_PREFIX + storeId, "true");
  },

  isAuthenticated(storeId: string): boolean {
    return sessionStorage.getItem(this.KEY_PREFIX + storeId) === "true";
  },

  logout(storeId: string) {
    sessionStorage.removeItem(this.KEY_PREFIX + storeId);
  }
};