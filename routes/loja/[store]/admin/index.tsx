import { PageProps } from "$fresh/server.ts";
import AdminPanelIsland from "../../../../islands/AdminPanelIsland.tsx";

export default function AdminPanel(props: PageProps) {
  return (
    <AdminPanelIsland {...props} />
  );
}