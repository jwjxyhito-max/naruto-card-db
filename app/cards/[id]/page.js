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
  // Next.js can pass a percent-encoded dynamic segment. Decode once before
  // encoding the canonical URL, otherwise Japanese IDs become %25E5... .
  let cardId = id;
  try {
    cardId = decodeURIComponent(id);
  } catch {
    // Preserve malformed legacy IDs rather than throwing on redirect.
  }
  permanentRedirect("/card/" + encodeURIComponent(cardId) + (suffix ? "?" + suffix : ""));
}
