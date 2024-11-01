import type { PageProps } from "$fresh/server.ts";
import LoginIsland from "../../../../islands/LoginIsland.tsx";

export default function Login(props: PageProps) {
  return <LoginIsland {...props} />;
}