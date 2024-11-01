// StorePageIsland.tsx
import { useEffect, useState } from "preact/hooks";
import { PageProps } from "$fresh/server.ts";
import Cart from "../components/store/Cart.tsx";
import CategoryList from "../components/store/CategoryList.tsx";
import ProductCard from "../components/store/ProductCard.tsx";
import type { Store, Category, Product, CartItem } from "../db/schema.ts";
import { CartStorage } from "../utils/cart.ts";
import { formatWhatsAppMessage } from "../utils/whatsapp.ts";
import Skeleton from "../components/common/Skeleton.tsx";

interface StorePageData {
  store: Store;
  categories: Category[];
  products: Product[];
  allProducts: Product[];
}

const StorePageIsland = ({ params }: PageProps) => {
  const [data, setData] = useState<StorePageData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    async function loadStoreData() {
      try {
        // Fetch store data
        const storeRes = await fetch(`/api/stores/${params.store}`);
        const store = await storeRes.json();

        // Fetch categories
        const categoriesRes = await fetch(`/api/categories?storeId=${params.store}`);
        const categories = await categoriesRes.json();

        // Fetch all products
        const allProductsRes = await fetch(`/api/products?storeId=${params.store}`);
        const allProducts = await allProductsRes.json();

        // Fetch products for the first category
        const firstCategory = categories[0]?.id;
        const products = allProducts.filter((product: Product) => product.categoryId === firstCategory);

        setData({ store, categories, products, allProducts });
        setSelectedCategory(firstCategory);
        
        // Carregar carrinho do localStorage
        const savedCart = CartStorage.getItems(params.store);
        setCartItems(savedCart);
      } catch (error) {
        console.error("Error loading store data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadStoreData();
  }, [params.store]);

  useEffect(() => {
    if (selectedCategory && data?.allProducts) {
      const products = data.allProducts.filter(
        (product) => product.categoryId === selectedCategory
      );
      setData((prev) => prev ? { ...prev, products } : null);
    }
  }, [selectedCategory, data?.allProducts]);

  if (loading) {
    return (
      <>
        {/* Replace spinner with skeleton screens */}
        <div class="p-4">
          <Skeleton height="2rem" /> {/* Skeleton for header */}
          <div class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} height="200px" />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!data) {
    return (
      <div class="flex flex-col items-center justify-center min-h-screen">
        <h1 class="text-2xl font-bold text-gray-800">Loja não encontrada</h1>
        <p class="text-gray-600 mt-2">Verifique o endereço e tente novamente</p>
      </div>
    );
  }

  const handleAddToCart = (product: Product, quantity: number, notes?: string) => {
    const newItem: CartItem = {
      productId: product.id,
      quantity,
      notes,
    };
    
    const updatedItems = [...cartItems];
    const existingIndex = updatedItems.findIndex(
      item => item.productId === product.id
    );

    if (existingIndex >= 0) {
      updatedItems[existingIndex].quantity += quantity;
    } else {
      updatedItems.push(newItem);
    }

    setCartItems(updatedItems);
    CartStorage.addItem(params.store, newItem);
  };

  const handleRemoveFromCart = (productId: string) => {
    const updatedItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedItems);
    CartStorage.removeItem(params.store, productId);
  };

  const handleCheckout = () => {
    const message = formatWhatsAppMessage(
      cartItems,
      data.products,
      data.store.name
    );
    const whatsappUrl = `https://wa.me/${data.store.whatsapp}?text=${message}`;
    globalThis.open(whatsappUrl, '_blank');
    // Limpar carrinho após enviar pedido
    setCartItems([]);
    CartStorage.clear(params.store);
  };

  return (
    <div class="min-h-screen bg-gray-50">
      {/* Header */}
      <header class="bg-white shadow sticky top-0 z-10">
        <div class="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 class="text-xl font-bold text-gray-900">{data.store.name}</h1>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            class="relative text-gray-700 focus:outline-none"
          >
            🛒
            {cartItems.length > 0 && (
              <span class="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Categories */}
      <CategoryList
        categories={data.categories}
        selectedId={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Products Grid */}
      <div class="max-w-7xl mx-auto px-4 py-6">
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data.products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={(quantity, notes) => handleAddToCart(product, quantity, notes)}
            />
          ))}
        </div>
      </div>

      {/* Cart */}
      {isCartOpen && (
        <Cart
          items={cartItems}
          products={data.allProducts}
          onRemoveItem={handleRemoveFromCart}
          onCheckout={handleCheckout}
          storeName={data.store.name}
          storeWhatsapp={data.store.whatsapp}
          onClose={() => setIsCartOpen(false)}
        />
      )}
    </div>
  );
};

export default StorePageIsland;