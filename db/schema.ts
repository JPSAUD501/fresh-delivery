export interface Store {
  id: string;
  name: string;
  whatsapp: string;
  password: string; // Para acesso admin (em produção usar hash)
  categoryCount?: number; // Optional, as it will be calculated
  productCount?: number; // Optional, as it will be calculated
}

export interface Category {
  id: string;
  storeId: string;
  name: string;
  order: number;
}

export interface Product {
  id: string;
  storeId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  active: boolean;
}

export interface CartItem {
  productId: string;
  quantity: number;
  notes?: string;
}
