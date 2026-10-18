import { permanentRedirect } from "next/navigation";

// Old /cards/:id links must resolve to the canonical /card/:id detail page.
// /cards (the archive) remains unchanged. Keep campaign UTMs during redirect.
export default async function LegacyCardDetail({ params, searchParams }) {
  const { id } = await params;
  const values = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(values ?? {})) {
    if (Array.isArray(value)) {
      for (const item of value) query.append(key, String(item));
    } else if (value != null) {
      query.append(key, String(value));
    }
  }

  const suffix = query.toString();
  permanentRedirect("/card/" + encodeURIComponent(id) + (suffix ? "?" + suffix : ""));
}
