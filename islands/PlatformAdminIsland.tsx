import { useEffect, useState } from "preact/hooks";
import type { Store } from "../db/schema.ts";

const PlatformAdminIsland = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (authenticated) {
      loadStores();
    }
  }, [authenticated]);

  const handleLogin = () => {
    if (password === "admin123") {
      setAuthenticated(true);
    } else {
      alert("Senha incorreta");
    }
  };

  async function loadStores() {
    try {
      const res = await fetch("/api/stores");
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to fetch stores");
      }
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid stores data");
      }
      setStores(data);
    } catch (error) {
      console.error("Error loading stores:", error);
      setStores([]); // Ensure stores is always an array
    }
  }

  const handleDeleteStore = async (storeId: string) => {
    try {
      await fetch(`/api/stores?storeId=${storeId}`, {
        method: "DELETE",
      });
      loadStores();
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  if (!authenticated) {
    return (
      <div class="min-h-screen flex items-center justify-center bg-gray-50">
        <div class="bg-white p-6 rounded-lg shadow-lg">
          <h2 class="text-2xl font-bold mb-4">Administração da Plataforma</h2>
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
            class="border p-2 rounded mb-4 w-full"
          />
          <button
            onClick={handleLogin}
            class="bg-blue-500 text-white p-2 rounded w-full"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gray-50">
      <header class="bg-white shadow">
        <div class="max-w-7xl mx-auto px-4 py-6">
          <h1 class="text-2xl font-bold text-gray-900">Administração da Plataforma</h1>
        </div>
      </header>

      {/* Store List */}
      <main class="max-w-7xl mx-auto px-4 py-6">
        <div class="bg-white rounded-lg shadow p-6">
          <h2 class="text-lg font-medium mb-4">Lojas Cadastradas</h2>
          <div class="space-y-4">
            {stores.map((store) => (
              <div key={store.id} class="flex flex-col sm:flex-row justify-between items-center border rounded-lg p-4">
                <div>
                  <h3 class="font-medium text-gray-800">{store.name}</h3>
                  <p class="text-sm text-gray-500">{store.whatsapp}</p>
                  <p class="text-sm text-gray-500">Categorias: {store.categoryCount}</p>
                  <p class="text-sm text-gray-500">Produtos: {store.productCount}</p>
                </div>
                <div class="flex space-x-4 mt-4 sm:mt-0">
                  <a
                    href={`/loja/${store.id}/admin`}
                    class="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Acessar Admin
                  </a>
                  <button
                    onClick={() => handleDeleteStore(store.id)}
                    class="text-sm text-red-600 hover:text-red-800"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlatformAdminIsland;
