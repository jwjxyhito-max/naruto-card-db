const required = ['cadence','headline','lead','picks','overseasSummary','catalysts','strategy','disclaimer'];
const text = (v, max = 16000) => typeof v === 'string' && v.trim().length > 0 && v.length <= max;
const https = v => { try { const u = new URL(v); return u.protocol === 'https:' && !u.username && !u.password; } catch { return false; } };

// Shared shape check for DB reads and the server worker. Legacy extra fields are readable.
export function isMarketAnalysis(v, {strict = false} = {}) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  if (strict && (Object.keys(v).length !== required.length || Object.keys(v).some(k => !required.includes(k)))) return false;
  if (!['cadence','headline','lead','strategy','disclaimer'].every(k => text(v[k]))) return false;
  if (strict && /[0-9０-９]|時間|毎朝|毎晩|毎日|朝夜|分ごと/.test(v.cadence)) return false;
  if (!Array.isArray(v.picks) || v.picks.length !== 5) return false;
  const ids = new Set();
  if (!v.picks.every((p,i) => {
    if (!p || Number(p.rank) !== i + 1 || !text(p.id,100) || ids.has(p.id)) return false;
    ids.add(p.id);
    if (!['name','judge','price','median','samples','discount','summary','detail','overseas'].every(k => text(p[k]))) return false;
    return https(p.mercariUrl) && new URL(p.mercariUrl).hostname === 'jp.mercari.com'
      && /^\/item\/m\d+$/.test(new URL(p.mercariUrl).pathname)
      && (!p.ebayUrl || (https(p.ebayUrl) && /(^|\.)ebay\.[a-z.]+$/.test(new URL(p.ebayUrl).hostname)));
  })) return false;
  return Array.isArray(v.overseasSummary) && v.overseasSummary.length > 0
    && v.overseasSummary.length <= 20 && v.overseasSummary.every(x => text(x))
    && Array.isArray(v.catalysts) && v.catalysts.length <= 30
    && v.catalysts.every(x => x && text(x.date,200) && text(x.text));
}

// Read only the first money value; decimal medians and explanatory percentages stay separate.
export function parseYen(value) {
  const m = String(value ?? '').match(/[0-9][0-9,]*(?:\.[0-9]+)?/);
  return m ? Number(m[0].replaceAll(',','')) : null;
}
