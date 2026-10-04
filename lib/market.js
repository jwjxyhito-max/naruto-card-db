// Public-safe market snapshot generated from the private research board.
// Only fields intended for the public site belong here. Raw notes and private board data stay out of the repository.
export const marketData={
 "忍-204":{soldCount:7,market:"単品SOLD 7標本を確認。状態・版・加工が未統一のため中央値は保留。",confidence:"SOLD確認済み",checkedAt:"2026-10-05 04:26 JST"},
 "忍-372":{soldCount:8,market:"単品SOLD 8標本を確認。状態・加工差があるため単一相場・中央値は保留。",confidence:"SOLD確認済み",checkedAt:"2026-10-05 05:14 JST"}
};
export function getMarketData(id){return marketData[id]||null;}