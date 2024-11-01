import { Category } from "../../db/schema.ts";
import { useState } from "preact/hooks";

interface ProductFormProps {
  categories: Category[];
  onSubmit: (data: {
    name: string;
    description: string;
    price: number;
    categoryId: string;
    imageUrl: string;
  }) => void;
}

export default function ProductForm({ categories, onSubmit }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: categories[0]?.id || "",
    imageUrl: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length === 0) {
      onSubmit({
        ...formData,
        price: parseFloat(formData.price),
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const validateForm = (data: typeof formData) => {
    const errors: { [key: string]: string } = {};
    if (!data.name) errors.name = "Nome é obrigatório.";
    if (!data.price || isNaN(parseFloat(data.price))) errors.price = "Preço inválido.";
    // ...additional validations...
    return errors;
  };

  const handleInputChange = (field: string) => (e: Event) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (target) {
      setFormData({ ...formData, [field]: target.value });
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange("name")}
          class={`mt-1 block w-full rounded-md border ${errors.name ? "border-red-500" : "border-gray-300"} shadow-sm`}
        />
        {errors.name && <p class="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Descrição</label>
        <textarea
          required
          value={formData.description}
          onChange={handleInputChange("description")}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Preço</label>
        <input
          type="number"
          step="0.01"
          required
          value={formData.price}
          onChange={handleInputChange("price")}
          class={`mt-1 block w-full rounded-md border ${errors.price ? "border-red-500" : "border-gray-300"} shadow-sm`}
        />
        {errors.price && <p class="text-red-500 text-sm mt-1">{errors.price}</p>}
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Categoria</label>
        <select
          required
          value={formData.categoryId}
          onChange={handleInputChange("categoryId")}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">URL da Imagem</label>
        <input
          type="url"
          required
          value={formData.imageUrl}
          onChange={handleInputChange("imageUrl")}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
      >
        Salvar Produto
      </button>
    </form>
  );
}
