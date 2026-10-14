// Public, versioned NARUTO card research. Never replaces the existing SOLD history.
export async function getCardResearch(cardId) {
  if (typeof cardId !== "string" || !cardId || cardId.length > 40) return null;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const params = new URLSearchParams({
    select: "card_id,snapshot_date,status,research",
    card_id: "eq." + cardId,
    published: "eq.true",
    order: "snapshot_date.desc,id.desc",
    limit: "1"
  });
  try {
    const response = await fetch(url + "/rest/v1/naruto_card_research_snapshots?" + params.toString(), {
      headers: {apikey:key, Authorization:"Bearer " + key},
      cache:"no-store"
    });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const body = await response.json();
    const row = Array.isArray(body) ? body[0] : null;
    if (!row || row.card_id !== cardId || !row.research || typeof row.research !== "object") return null;
    return row;
  } catch (error) {
    console.error("NARUTO card research unavailable:", error.message);
    return null;
  }
}
