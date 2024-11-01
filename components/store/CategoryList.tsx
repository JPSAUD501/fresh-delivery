import { Category } from "../../db/schema.ts";

interface CategoryListProps {
  categories: Category[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function CategoryList({ categories, selectedId, onSelect }: CategoryListProps) {
  return (
    <nav class="flex overflow-x-auto gap-2 px-4 py-2 bg-white shadow" aria-label="Lista de categorias">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          class={`px-4 py-2 rounded-full whitespace-nowrap focus:outline-none focus:ring ${
            selectedId === category.id
              ? "bg-primary text-white shadow"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          aria-pressed={selectedId === category.id}
          aria-label={`Selecionar categoria ${category.name}`}
        >
          {category.name}
        </button>
        ))}
    </nav>
  );
}
