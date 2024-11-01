import { FunctionalComponent } from "preact";

interface SidebarProps {
  activeTab: "dashboard" | "products" | "categories" | "settings";
  onTabChange: (tab: "dashboard" | "products" | "categories" | "settings") => void;
}

const Sidebar: FunctionalComponent<SidebarProps> = ({ activeTab, onTabChange }) => {
  return (
    <div class="w-64 bg-white shadow-md">
      <nav class="flex flex-col p-4 space-y-2">
        <button
          class={`text-left px-4 py-2 rounded ${activeTab === "dashboard" ? "bg-gray-200" : ""}`}
          onClick={() => onTabChange("dashboard")}
        >
          Dashboard
        </button>
        <button
          class={`text-left px-4 py-2 rounded ${activeTab === "products" ? "bg-gray-200" : ""}`}
          onClick={() => onTabChange("products")}
        >
          Produtos
        </button>
        <button
          class={`text-left px-4 py-2 rounded ${activeTab === "categories" ? "bg-gray-200" : ""}`}
          onClick={() => onTabChange("categories")}
        >
          Categorias
        </button>
        <button
          class={`text-left px-4 py-2 rounded ${activeTab === "settings" ? "bg-gray-200" : ""}`}
          onClick={() => onTabChange("settings")}
        >
          Configurações
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
