import { Product } from "../../db/schema.ts";
import { useState } from "preact/hooks";

interface ProductCardProps {
  product: Product;
  onAddToCart: (quantity: number, notes?: string) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div class="flex flex-col bg-white rounded-lg shadow p-4 gap-4">
      <img
        src={product.imageUrl}
        alt={`Imagem de ${product.name}`}
        loading="lazy"
        class="w-full h-40 object-cover rounded-lg"
      />
      
      <div class="flex flex-col flex-1 mt-4">
        <h3 class="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p class="text-gray-600 text-sm mt-1 flex-1">{product.description}</p>
        <p class="text-primary font-bold mt-2">
          R$ {product.price.toFixed(2)}
        </p>

        <div class="flex items-center gap-2 mt-2">
          <button
            class="p-2 bg-gray-200 rounded focus:outline-none focus:ring"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            aria-label="Diminuir quantidade"
          >
            -
          </button>
          <span class="font-semibold" aria-label={`Quantidade selecionada: ${quantity}`}>{quantity}</span>
          <button
            class="p-2 bg-gray-200 rounded focus:outline-none focus:ring"
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Aumentar quantidade"
          >
            +
          </button>
        </div>

        <button
          class="text-sm text-gray-600 underline focus:outline-none focus:ring"
          onClick={() => setShowNotes(!showNotes)}
          aria-expanded={showNotes}
        >
          {showNotes ? "Ocultar observações" : "Adicionar observações"}
        </button>

        {showNotes && (
          <textarea
            value={notes}
            onChange={(e) => {
              if (e.target) {
                setNotes((e.target as HTMLTextAreaElement).value);
              }
            }}
            placeholder="Ex: Sem cebola, bem passado..."
            class="w-full p-2 border rounded focus:outline-none focus:ring"
            aria-label="Observações adicionais"
          />
        )}

        <button
          onClick={() => onAddToCart(quantity, notes)}
          class="mt-4 bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300 focus:outline-none focus:ring"
          aria-label={`Adicionar ${quantity} ${product.name} ao carrinho`}
        >
          Adicionar ao carrinho
        </button>
      </div>
    </div>
  );
}
