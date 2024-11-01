import { Handlers } from "$fresh/server.ts";
import { StoreDB, CategoryDB, ProductDB } from "../../../db/kv.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");

    if (storeId) {
      try {
        const store = await StoreDB.get(storeId);
        if (!store) {
          return new Response(JSON.stringify({ error: "Store not found" }), {
            headers: { "Content-Type": "application/json" },
            status: 404,
          });
        }

        const categories = await CategoryDB.listByStore(storeId);
        const products = await ProductDB.listByStore(storeId);

        return new Response(JSON.stringify({
          ...store,
          categoryCount: categories.length,
          productCount: products.length,
        }), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        return new Response(JSON.stringify({ error: errorMessage }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }
    }

    try {
      const stores = await StoreDB.list();
      const storesWithCounts = await Promise.all(stores.map(async (store) => {
        const categories = await CategoryDB.listByStore(store.id);
        const products = await ProductDB.listByStore(store.id);
        return {
          ...store,
          categoryCount: categories.length,
          productCount: products.length,
        };
      }));

      return new Response(JSON.stringify(storesWithCounts), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  },

  async POST(req) {
    try {
      const body = await req.json();
      const store = await StoreDB.create({
        name: body.name,
        whatsapp: body.whatsapp,
        password: body.password,
      });
      
      return new Response(JSON.stringify(store), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (error) {
      const errorMessage = (error as Error).message;
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  },

  async PUT(req) {
    try {
      const url = new URL(req.url);
      const storeId = url.searchParams.get("storeId");

      if (!storeId) {
        return new Response(JSON.stringify({ error: "storeId is required" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      const body = await req.json();
      const updatedStore = await StoreDB.update(storeId, {
        name: body.name,
        whatsapp: body.whatsapp,
      });

      return new Response(JSON.stringify(updatedStore), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  },

  async DELETE(req) {
    try {
      const url = new URL(req.url);
      const storeId = url.searchParams.get("storeId");

      if (!storeId) {
        return new Response(JSON.stringify({ error: "storeId is required" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      await StoreDB.delete(storeId);
      return new Response(null, { status: 204 });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  },
};
