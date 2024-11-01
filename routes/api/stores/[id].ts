import { Handlers } from "$fresh/server.ts";
import { StoreDB } from "../../../db/kv.ts";

export const handler: Handlers = {
  async GET(_, ctx) {
    const store = await StoreDB.get(ctx.params.id);
    if (!store) {
      return new Response(JSON.stringify({ error: "Store not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Não retorna a senha
    const { password: _password, ...safeStore } = store;
    return new Response(JSON.stringify(safeStore), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
