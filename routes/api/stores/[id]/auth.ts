import { Handlers } from "$fresh/server.ts";
import { StoreDB } from "../../../../db/kv.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const { password } = await req.json();
    const authenticated = await StoreDB.authenticate(ctx.params.id, password);

    if (authenticated) {
      return new Response(null, { status: 200 });
    } else {
      return new Response(null, { status: 401 });
    }
  },
};