import test from "node:test";
import assert from "node:assert/strict";
import {AMAZON_ASSOCIATE_TAG,amazonProductUrl,amazonSearchUrl,amazonStorefrontUrl,recommendedCategories,recommendedProducts} from "../lib/recommendedProducts.js";

test("All purchase and storefront links use the owner's confirmed Japanese Associates tag",()=>{
 assert.equal(AMAZON_ASSOCIATE_TAG,"naruto-card-22");
 for(const href of [amazonStorefrontUrl,...recommendedProducts.map(product=>product.url)]){
  const url=new URL(href);
  assert.equal(url.origin,"https://www.amazon.co.jp");
  assert.deepEqual(url.searchParams.getAll("tag"),["naruto-card-22"]);
 }
});

test("Every selection is reachable in exactly one valid category with a unique anchor",()=>{
 const groups=recommendedCategories.map(category=>category.id);
 assert.equal(new Set(groups).size,groups.length);
 assert.equal(new Set(recommendedProducts.map(product=>product.id)).size,recommendedProducts.length);
 assert.ok(recommendedProducts.length>0);
 for(const product of recommendedProducts){
  assert.ok(groups.includes(product.category));
  assert.match(product.id,/^[a-z0-9-]+$/);
  assert.ok(product.reason&&product.check);
  const url=new URL(product.url);
  if(product.kind==="search")assert.ok(url.pathname==="/s"&&url.searchParams.get("k"));
  else assert.match(url.pathname,/^\/dp\/[A-Z0-9]{10}$/);
 }
});

test("Product links reject malformed IDs and searches retain Japanese terms",()=>{
 for(const asin of ["", "4088728408/", "../../other", "https://example.com"])assert.throws(()=>amazonProductUrl(asin));
 const search=new URL(amazonSearchUrl("THE LAST ナルト Blu-ray ANSX-11371"));
 assert.equal(search.searchParams.get("k"),"THE LAST ナルト Blu-ray ANSX-11371");
 assert.equal(new URL(amazonProductUrl("4088728408")).pathname,"/dp/4088728408");
});
