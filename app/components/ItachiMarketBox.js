import {ITACHI_MARKET_LABEL,itachiMarketBlogUrl} from "../../lib/blogLinks";

export function ItachiMarketBox({utmContent,lead,headingId}){
 return <aside className="itachiMarketBox">
  <div>
   <span className="eyebrow">WEEKLY MARKET</span>
   <h2 id={headingId}>{ITACHI_MARKET_LABEL}</h2>
   <p>{lead}</p>
  </div>
  <a href={itachiMarketBlogUrl(utmContent)} target="_blank" rel="noopener noreferrer">{ITACHI_MARKET_LABEL}<span aria-hidden="true"> ↗</span></a>
 </aside>;
}
