import { useState } from "preact/hooks";

interface StoreFormProps {
  onSubmit: (data: { name: string; whatsapp: string; password: string }) => void;
  onClose: () => void;
}

function StoreForm({ onSubmit, onClose }: StoreFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    whatsapp: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = "Nome é obrigatório";
    if (!formData.whatsapp) newErrors.whatsapp = "WhatsApp é obrigatório";
    if (!formData.password) newErrors.password = "Senha é obrigatória";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
    onClose();
  };

  return (
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <form onSubmit={handleSubmit} class="bg-white p-6 rounded-lg space-y-4">
        <h2 class="text-lg font-medium">Adicionar Loja</h2>
        <div>
          <label class="block text-sm font-medium text-gray-700">Nome da Loja</label>
          <input
            type="text"
            required
            value={formData.name}
            onInput={(e) =>
              setFormData({ ...formData, name: (e.target as HTMLInputElement).value })
            }
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.name && <p class="text-sm text-red-600">{errors.name}</p>}
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">WhatsApp</label>
          <input
            type="text"
            required
            value={formData.whatsapp}
            onInput={(e) =>
              setFormData({ ...formData, whatsapp: (e.target as HTMLInputElement).value })
            }
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.whatsapp && <p class="text-sm text-red-600">{errors.whatsapp}</p>}
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Senha</label>
          <input
            type="password"
            required
            value={formData.password}
            onInput={(e) =>
              setFormData({ ...formData, password: (e.target as HTMLInputElement).value })
            }
            class="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
          {errors.password && <p class="text-sm text-red-600">{errors.password}</p>}
        </div>
        <div class="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onClose}
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded"
          >
            Cancelar
          </button>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
            Adicionar Loja
          </button>
        </div>
      </form>
    </div>
  );
}

export default StoreForm;
