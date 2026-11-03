// Use only the explicit, current comparable SOLD count. Prices, old counts and
// counts of excluded transactions in detail text are not evidence of more sales.
export function comparableSoldCount(pick) {
  const counts=[pick?.samples,pick?.median].map(value=>{
    const text=String(value??"").normalize("NFKC");
    const match=text.match(/条件一致\s*SOLD\s*(\d+)\s*件/i)
      || text.match(/^\s*(\d+)\s*件/);
    return match?Number(match[1]):null;
  }).filter(value=>value!==null);
  return counts.length?Math.min(...counts):0;
}

export function selectHomeMarketPicks(picks=[],limit=3) {
  // Preserve all source records/ranks for the full analysis and card pages.
  // Never fill spare home slots with one-sale or unknown-evidence records.
  return picks.filter(pick=>!pick.soldOut && comparableSoldCount(pick)>=2)
    .sort((a,b)=>comparableSoldCount(b)-comparableSoldCount(a)
      || (Number(a.rank)||Infinity)-(Number(b.rank)||Infinity))
    .slice(0,limit);
}
