export function queryValue(value){return typeof value==="string"?value:"";}

export function paginate(list,requestedPage,size=30){
 const number=Number(queryValue(requestedPage));
 const pages=Math.max(1,Math.ceil(list.length/size));
 const page=Math.min(pages,Number.isSafeInteger(number)&&number>0?number:1);
 return {page,pages,items:list.slice((page-1)*size,page*size),total:list.length};
}

export function pageHref(path,params,page){
 const query=new URLSearchParams();
 for(const [key,value] of Object.entries(params))if(value)query.set(key,value);
 if(page>1)query.set("page",String(page));
 return path+(query.size?"?"+query.toString():"");
}
