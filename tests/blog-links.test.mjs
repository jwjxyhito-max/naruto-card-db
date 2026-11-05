import test from "node:test";
import assert from "node:assert/strict";
import {ITACHI_MARKET_LABEL,cardArticlePaths,cardDetailBlogUrl,footerBlogUrl,itachiMarketBlogUrl,itachiMarketCardIds} from "../lib/blogLinks.js";

function assertBlog(href,pathname,utmContent){
 const url=new URL(href);
 assert.equal(url.origin,"https://jakusha-no-tatakai.com");
 assert.equal(url.pathname,pathname);
 assert.deepEqual([...url.searchParams.entries()],[
  ["utm_source","naruto-card-db"],
  ["utm_medium","referral"],
  ["utm_campaign","blog_link"],
  ["utm_content",utmContent]
 ]);
}

test("Card pages link to a dedicated article when one exists, otherwise the market roundup",()=>{
 assertBlog(cardDetailBlogUrl("忍-1"),"/naruto-kyu-card-souba/","card_detail");
 assertBlog(cardDetailBlogUrl("忍-4"),"/naruto-kyu-card-souba/","card_detail");
 assertBlog(cardDetailBlogUrl("忍-16"),"/naruto-nin-16-haku-market-20261020/","card_detail");
 assertBlog(cardDetailBlogUrl("忍-17"),"/naruto-nin-17-haku-rare-market-20261021/","card_detail");
 assertBlog(cardDetailBlogUrl("忍-19"),"/naruto-nin-19-uzumaki-naruto-ur-market-20261023/","card_detail");
 assertBlog(cardDetailBlogUrl("忍-20"),"/naruto-nin-20-sasuke-ur-market-20261024/","card_detail");
 assertBlog(cardDetailBlogUrl("忍-21"),"/naruto-nin-21-sakura-ur-market-20261025/","card_detail");
 assertBlog(cardDetailBlogUrl("忍-22"),"/naruto-nin-22-iruka-sr-market-20261026/","card_detail");
 assertBlog(cardDetailBlogUrl("DN-051T"),"/naruto-kyubi-mandarake-dn051t/","card_detail");
 assert.equal(Object.keys(cardArticlePaths).length,7);
});

test("The footer blog link keeps the blog home and uses the footer campaign content",()=>{
 assertBlog(footerBlogUrl(),"/","footer");
});

test("The weekly Itachi market article is linked from the home page and two card pages",()=>{
 assert.equal(ITACHI_MARKET_LABEL,"イタチ相場推移（毎週更新）");
 assert.deepEqual(itachiMarketCardIds,["忍-203","忍-259"]);
 assertBlog(itachiMarketBlogUrl("home"),"/naruto-card-itachi-souba/","home");
 assertBlog(itachiMarketBlogUrl("itachi_card"),"/naruto-card-itachi-souba/","itachi_card");
});
