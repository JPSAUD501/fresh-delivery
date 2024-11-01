import { PageProps } from "$fresh/server.ts";
import StorePageIsland from "../../../islands/StorePageIsland.tsx";

export default function StorePage(props: PageProps) {
  return (
    <StorePageIsland {...props} />
  );
}