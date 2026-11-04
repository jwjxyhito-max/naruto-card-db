// Blog articles for 弱者には弱者の戦い方. Add a card id here when it gets its own post.
const BLOG_ORIGIN="https://jakusha-no-tatakai.com";
const DEFAULT_ARTICLE_PATH="/naruto-kyu-card-souba/";

export const cardArticlePaths={
 "忍-16":"/naruto-nin-16-haku-market-20261020/",
 "忍-17":"/naruto-nin-17-haku-rare-market-20261021/",
 "忍-19":"/naruto-nin-19-uzumaki-naruto-ur-market-20261023/",
 "忍-20":"/naruto-nin-20-sasuke-ur-market-20261024/",
 "忍-21":"/naruto-nin-21-sakura-ur-market-20261025/",
 "忍-22":"/naruto-nin-22-iruka-sr-market-20261026/",
 "DN-051T":"/naruto-kyubi-mandarake-dn051t/"
};

export function blogUrl(pathname,utmContent){
 const url=new URL(pathname,BLOG_ORIGIN);
 url.searchParams.set("utm_source","naruto-card-db");
 url.searchParams.set("utm_medium","referral");
 url.searchParams.set("utm_campaign","blog_link");
 url.searchParams.set("utm_content",utmContent);
 return url.href;
}

export function cardDetailBlogUrl(cardId){
 return blogUrl(cardArticlePaths[cardId]||DEFAULT_ARTICLE_PATH,"card_detail");
}

export function footerBlogUrl(){
 return blogUrl("/","footer");
}
