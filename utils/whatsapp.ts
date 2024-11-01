import { CartItem } from "../db/schema.ts";
import { Product } from "../db/schema.ts";

export function formatWhatsAppMessage(
  items: CartItem[],
  products: Product[],
  storeName: string
): string {
  let message = `*Novo pedido - ${storeName}*\n\n`;
  let total = 0;

  items.forEach(item => {
    const product = products.find(p => p.id === item.productId);
    if (product) {
      const subtotal = product.price * item.quantity;
      total += subtotal;
      
      message += `${item.quantity}x ${product.name}\n`;
      message += `R$ ${product.price.toFixed(2)} cada = R$ ${subtotal.toFixed(2)}\n`;
      if (item.notes) {
        message += `Obs: ${item.notes}\n`;
      }
      message += '\n';
    }
  });

  message += `\n*Total: R$ ${total.toFixed(2)}*`;
  
  return encodeURIComponent(message);
}
