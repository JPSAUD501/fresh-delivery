import { Handlers } from "$fresh/server.ts";
import { CategoryDB } from "../../../db/kv.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const category = await CategoryDB.create({
        storeId: body.storeId,
        name: body.name,
        order: body.order,
      });
      
      return new Response(JSON.stringify(category), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (error) {
      const err = error as Error;
      return new Response(JSON.stringify({ error: err.message }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  },

  async GET(req) {
    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");
    
    if (!storeId) {
      return new Response(JSON.stringify({ error: "storeId is required" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }

    const categories = await CategoryDB.listByStore(storeId);
    return new Response(JSON.stringify(categories), {
      headers: { "Content-Type": "application/json" },
    });
  },

  async DELETE(req) {
    try {
      const url = new URL(req.url);
      const storeId = url.searchParams.get("storeId");
      const categoryId = url.searchParams.get("categoryId");

      if (!storeId || !categoryId) {
        return new Response(JSON.stringify({ error: "storeId and categoryId are required" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      await CategoryDB.delete(storeId, categoryId);
      return new Response(null, { status: 204 });
    } catch (error) {
      const err = error as Error;
      return new Response(JSON.stringify({ error: err.message }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  },
};
