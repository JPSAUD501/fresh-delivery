import { useState } from "preact/hooks";

type CategoryFormProps = {
  onSubmit: (data: { name: string; order: number }) => Promise<void>;
  onClose: () => void;
};

export default function CategoryForm({ onSubmit }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    order: "",
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSubmit({
      name: formData.name,
      order: parseInt(formData.order),
    });
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nome</label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => {
            const target = e.target as HTMLInputElement | null;
            if (target) {
              setFormData({ ...formData, name: target.value });
            }
          }}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Ordem</label>
        <input
          type="number"
          required
          value={formData.order}
          onChange={(e) => {
            const target = e.target as HTMLInputElement | null;
            if (target) {
              setFormData({ ...formData, order: target.value });
            }
          }}
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <button
        type="submit"
        class="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors duration-300"
      >
        Salvar Categoria
      </button>
    </form>
  );
}
