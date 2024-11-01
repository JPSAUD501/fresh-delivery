import { Handlers } from "$fresh/server.ts";
import { ProductDB } from "../../../db/kv.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const product = await ProductDB.create({
        storeId: body.storeId,
        categoryId: body.categoryId,
        name: body.name,
        description: body.description,
        price: body.price,
        imageUrl: body.imageUrl,
        active: true,
      });
      
      return new Response(JSON.stringify(product), {
        headers: { "Content-Type": "application/json" },
        status: 201,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
      });
    }
  },

  async GET(req) {
    const url = new URL(req.url);
    const storeId = url.searchParams.get("storeId");
    const categoryId = url.searchParams.get("categoryId");

    if (!storeId) {
      return new Response(
        JSON.stringify({ error: "storeId is required" }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    let products;
    if (categoryId) {
      products = await ProductDB.listByCategory(storeId, categoryId);
    } else {
      products = await ProductDB.listByStore(storeId);
    }

    return new Response(JSON.stringify(products), {
      headers: { "Content-Type": "application/json" },
    });
  },

  async DELETE(req) {
    try {
      const url = new URL(req.url);
      const storeId = url.searchParams.get("storeId");
      const productId = url.searchParams.get("productId");

      if (!storeId || !productId) {
        return new Response(JSON.stringify({ error: "storeId and productId are required" }), {
          headers: { "Content-Type": "application/json" },
          status: 400,
        });
      }

      await ProductDB.delete(storeId, productId);
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
