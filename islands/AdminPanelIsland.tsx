import { PageProps } from "$fresh/server.ts";
import { useEffect, useState } from "preact/hooks";
import CategoryForm from "../components/admin/CategoryForm.tsx";
import ProductForm from "../components/admin/ProductForm.tsx";
import type { Store, Category, Product } from "../db/schema.ts";
import { AdminAuth } from "../utils/cart.ts";
import Sidebar from "../components/admin/Sidebar.tsx";
import ConfirmationModal from "../components/admin/ConfirmationModal.tsx";

const AdminPanelIsland = ({ params }: PageProps) => {
  const [store, setStore] = useState<Store | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "categories" | "settings">("dashboard");

  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  useEffect(() => {
    if (!AdminAuth.isAuthenticated(params.store)) {
      globalThis.location.href = `/loja/${params.store}/admin/login`;
      return;
    }

    loadData();
  }, []);

  async function loadData() {
    try {
      // Carregar dados da loja
      const storeRes = await fetch(`/api/stores/${params.store}`);
      const storeData = await storeRes.json();
      setStore(storeData);

      // Carregar categorias
      const categoriesRes = await fetch(`/api/categories?storeId=${params.store}`);
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);

      // Carregar produtos
      const productsPromises = categoriesData.map((category: Category) =>
        fetch(`/api/products?storeId=${params.store}&categoryId=${category.id}`)
          .then(res => res.json())
      );
      const productsData = await Promise.all(productsPromises);
      setProducts(productsData.flat());
    } catch (error) {
      console.error("Error loading admin data:", error);
    }
  }

  const handleAddProduct = async (data: { name: string; description: string; price: number; imageUrl: string; categoryId: string }) => {
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          storeId: params.store,
        }),
      });
      loadData();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleAddCategory = async (data: { name: string; order: number }) => {
    try {
      await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          storeId: params.store,
        }),
      });
      loadData();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  const handleDeleteProduct = (productId: string) => {
    setProductToDelete(productId);
    setShowDeleteProductModal(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await fetch(`/api/products?storeId=${params.store}&productId=${productToDelete}`, {
          method: "DELETE",
        });
        loadData();
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setShowDeleteProductModal(false);
        setProductToDelete(null);
      }
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await fetch(`/api/categories?storeId=${params.store}&categoryId=${categoryId}`, {
        method: "DELETE",
      });
      loadData();
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleUpdateStore = async (data: { name: string; whatsapp: string }) => {
    try {
      await fetch(`/api/stores?storeId=${params.store}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      loadData();
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  return (
    <div class="min-h-screen flex">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <div class="flex-1 bg-gray-50">
        {/* Header */}
        <header class="bg-white shadow">
          <div class="max-w-7xl mx-auto px-4 py-6">
            <div class="flex justify-between items-center">
              <h1 class="text-2xl font-bold text-gray-900">
                Painel Administrativo - {store?.name}
              </h1>
              <button
                onClick={() => {
                  AdminAuth.logout(params.store);
                  globalThis.location.href = `/loja/${params.store}/admin/login`;
                }}
                class="text-sm text-red-600 hover:text-red-800"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main class="flex-1 p-6 overflow-y-auto">
          {activeTab === "dashboard" && (
            // Dashboard content with quick stats and recent activity
            <div>Dashboard Content</div>
          )}

          {activeTab === "products" && (
            <div class="space-y-6">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">Produtos</h2>
                <button
                  onClick={() => setShowProductForm(true)}
                  class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                  Adicionar Produto
                </button>
              </div>
              {/* Display product list in a table with search and pagination */}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product.id} class="border rounded-lg p-4">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      class="w-full h-48 object-cover rounded-lg mb-2"
                    />
                    <h3 class="font-medium">{product.name}</h3>
                    <p class="text-sm text-gray-500">{product.description}</p>
                    <p class="text-primary font-medium mt-2">
                      R$ {product.price.toFixed(2)}
                    </p>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      class="text-sm text-red-600 hover:text-red-800 mt-2"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              {showProductForm && (
                // Show product form in a modal or inline with improved UI
                <ProductForm
                  categories={categories}
                  onSubmit={handleAddProduct}
                />
              )}
            </div>
          )}

          {activeTab === "categories" && (
            <div class="space-y-6">
              <div class="flex justify-between items-center">
                <h2 class="text-2xl font-bold">Categorias</h2>
                <button
                  onClick={() => setShowCategoryForm(true)}
                  class="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                  Adicionar Categoria
                </button>
              </div>
              {/* Display category list in a table with edit options */}
              <div class="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    class="flex justify-between items-center border rounded-lg p-4"
                  >
                    <div>
                      <h3 class="font-medium">{category.name}</h3>
                      <p class="text-sm text-gray-500">
                        {category.name}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      class="text-sm text-red-600 hover:text-red-800"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
              {showCategoryForm && (
                <CategoryForm
                  onSubmit={handleAddCategory}
                  onClose={() => setShowCategoryForm(false)}
                />
              )}
            </div>
          )}

          {activeTab === "settings" && (
            // Settings form for updating store information more intuitively
            <div class="bg-white rounded-lg shadow p-6">
              <h2 class="text-lg font-medium mb-4">Atualizar Loja</h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  handleUpdateStore({
                    name: formData.get("name") as string,
                    whatsapp: formData.get("whatsapp") as string,
                  });
                }}
              >
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">Nome</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={store?.name}
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <div class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">WhatsApp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    defaultValue={store?.whatsapp}
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                  />
                </div>
                <button
                  type="submit"
                  class="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  Atualizar
                </button>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Confirmation Modal */}
      {showDeleteProductModal && (
        <ConfirmationModal
          message="Tem certeza que deseja remover este produto?"
          onConfirm={confirmDeleteProduct}
          onCancel={() => setShowDeleteProductModal(false)}
        />
      )}
    </div>
  );
}

export default AdminPanelIsland;