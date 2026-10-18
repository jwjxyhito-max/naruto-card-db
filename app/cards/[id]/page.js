import { permanentRedirect } from "next/navigation";

// Legacy plural detail links (e.g. /cards/PR忍-17) previously returned 404.
// Keep /cards as the collection page, and send only /cards/:id to /card/:id.
export default async function LegacyCardDetail({ params }) {
  const { id } = await params;
  permanentRedirect("/card/" + encodeURIComponent(id));
}
