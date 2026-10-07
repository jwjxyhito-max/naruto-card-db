import {cards} from "./cards";
export const marketStatus={
  checkedAt:"2026-10-04T11:25:00+09:00",
  checkedLabel:"2026.10.04",
  checkedTime:"11:25 JST",
  source:"DOT / 共有ボード",
};
export function getDbStats(){
 const sold=cards.filter(c=>c.market.includes("SOLD"));
 const priority=cards.filter(c=>["A","B","WATCH"].includes(c.rank));
 return {total:cards.length,soldCount:sold.length,priorityCount:priority.length,sold};
}