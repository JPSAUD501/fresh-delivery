import { useState } from "preact/hooks";
import type { PageProps } from "$fresh/server.ts";
import { AdminAuth } from "../utils/auth.ts";

export default function LoginIsland({ params }: PageProps) {
  const [_error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    // Lógica de login
    try {
      const response = await fetch(`/api/stores/${params.store}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        AdminAuth.setAuthenticated(params.store);
        globalThis.location.href = `/loja/${params.store}/admin`;
      } else {
        setError("Senha incorreta");
      }
    } catch (_err) {
      setError("Erro ao fazer login");
    }
  };

  const handleChange = (e: Event) => {
    if (e.target instanceof HTMLInputElement) {
      setPassword(e.target.value);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-blue-500 px-4">
      <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-bold text-center text-gray-800">
          Login Administrativo
        </h2>
        <form onSubmit={handleSubmit} class="mt-6 space-y-4">
          <div class="rounded-md shadow-sm -space-y-px">
            <div>
              <label for="password" class="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Senha"
                onInput={handleChange}
                value={password}
              />
            </div>
          </div>
          {_error && (
            <div class="text-red-500 text-sm mt-2">{_error}</div>
          )}
          <button
            type="submit"
            class="w-full py-2 px-4 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors duration-300"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}