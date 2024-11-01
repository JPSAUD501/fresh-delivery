import { PageProps } from "$fresh/server.ts";
import PlatformAdminIsland from "../islands/PlatformAdminIsland.tsx";

export default function PlatformAdminPage(_props: PageProps) {
  return (
    <div>
      <PlatformAdminIsland />
    </div>
  );
}
