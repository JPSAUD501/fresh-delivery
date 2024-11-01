import type { CartItem, Product } from "../../db/schema.ts";

interface CartProps {
  items: CartItem[];
  products: Product[];
  onRemoveItem: (productId: string) => void;
  onCheckout: () => void;
  storeName: string;
  storeWhatsapp: string;
  onClose: () => void;
}

const Cart = ({
  items,
  products,
  onRemoveItem,
  onCheckout,
  onClose,
}: CartProps) => {
  const getProduct = (productId: string) =>
    products.find((product) => product.id === productId);

  const total = items.reduce((sum, item) => {
    const product = getProduct(item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center" role="dialog" aria-modal="true" aria-labelledby="cart-title">
      <div class="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} aria-hidden="true"></div>
      <div class="bg-white rounded-t-lg sm:rounded-lg shadow-lg p-6 w-full sm:max-w-sm max-h-full overflow-y-auto z-50">
        {/* Header */}
        <div class="flex justify-between items-center mb-4">
          <h2 id="cart-title" class="text-lg font-medium">Carrinho</h2>
          <button onClick={onClose} class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring" aria-label="Fechar carrinho">
            ✕
          </button>
        </div>
        {/* Cart Items */}
        <ul class="space-y-4">
          {items.map((item) => {
            const product = getProduct(item.productId);
            if (!product) return null;
            return (
              <li
                key={item.productId}
                class="flex flex-col border rounded-lg p-4"
              >
                <div>
                  <h3 class="font-medium">{product.name}</h3>
                  <p class="text-sm text-gray-500">
                    Quantidade: {item.quantity}
                  </p>
                  {item.notes && (
                    <p class="text-sm text-gray-500">Observações: {item.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => onRemoveItem(item.productId)}
                  class="text-sm text-red-600 hover:text-red-800 mt-2 self-end focus:outline-none focus:ring"
                  aria-label={`Remover ${product.name} do carrinho`}
                >
                  Remover
                </button>
              </li>
            );
          })}
        </ul>
        {/* Total and Checkout */}
        <div class="mt-4 flex justify-between items-center">
          <span class="font-bold">Total:</span>
          <span class="font-bold">R$ {total.toFixed(2)}</span>
        </div>
        <button
          onClick={onCheckout}
          class="mt-4 bg-green-500 text-white py-2 rounded w-full hover:bg-green-600 transition-colors duration-300 focus:outline-none focus:ring"
          aria-label="Finalizar pedido"
        >
          Finalizar Pedido
        </button>
      </div>
    </div>
  );
};

export default Cart;
