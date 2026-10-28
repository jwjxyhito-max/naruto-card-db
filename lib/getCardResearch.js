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
      next:{revalidate:1800,tags:["naruto-public-data"]}
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

// Read summaries only. Multiple dated snapshots count as one researched card.
export async function getCardResearchIndex() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  const records = new Map();
  const pageSize = 500;
  try {
    for (let page = 0; page < 20; page++) {
      const params = new URLSearchParams({
        select: "id,card_id,snapshot_date,status,name:research->>name",
        published: "eq.true",
        order: "snapshot_date.desc,id.desc",
        limit: String(pageSize),
        offset: String(page * pageSize)
      });
      const response = await fetch(url + "/rest/v1/naruto_card_research_snapshots?" + params.toString(), {
        headers: {apikey:key, Authorization:"Bearer " + key},
        next: {revalidate:1800,tags:["naruto-public-data"]}
      });
      if (!response.ok) throw new Error("HTTP " + response.status);
      const rows = await response.json();
      if (!Array.isArray(rows)) throw new Error("Invalid research index");
      for (const row of rows) {
        if (typeof row.card_id !== "string" || !row.card_id || row.card_id.length > 40 ||
            typeof row.name !== "string" || !row.name ||
            !/^\d{4}-\d{2}-\d{2}$/.test(row.snapshot_date) ||
            !["complete", "research_incomplete"].includes(row.status)) {
          throw new Error("Invalid research summary");
        }
        if (!records.has(row.card_id)) records.set(row.card_id, row);
      }
      if (rows.length < pageSize) return [...records.values()];
    }
    throw new Error("Research index exceeds paging limit");
  } catch (error) {
    console.error("NARUTO card research index unavailable:", error.message);
    return null;
  }
}
