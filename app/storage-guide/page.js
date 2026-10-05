export const metadata={
 title:"カードの価値別・おすすめ保管方法｜NARUTO旧カードDB",
 description:"通常カードから高額カード、PSA鑑定候補・PSA鑑定品まで、カードの価値と目的に合わせた保管方法を段階別に解説します。",
 alternates:{canonical:"/storage-guide"}
};

const A=({href,children})=><a className="storageProduct" href={href} target="_blank" rel="sponsored nofollow noreferrer">{children}</a>;
const Step=({level,title,summary,children,product})=><details className="storageTier">
 <summary><span><small>{level}</small><b>{title}</b><em>{summary}</em></span><strong>詳しく見る ＋</strong></summary>
 <div className="storageBody">{children}{product}</div>
</details>;

export default function StorageGuide(){
 return <main className="storageGuidePage">
  <a className="back" href="/">← NARUTO旧カードDB</a>
  <section className="guideHero"><span className="eyebrow">VALUE BASED STORAGE GUIDE</span><h1>カードの価値別・<br/>おすすめ保管方法</h1><p>高い用品を全部のカードに使う必要はありません。カードの価値・状態・鑑定予定に合わせて、保護レベルを上げる考え方をまとめました。</p></section>

  <section className="storageQuick"><div><b>通常</b><span>スリーブ</span></div><div><b>少し価値あり</b><span>＋硬質ケース</span></div><div><b>高額</b><span>＋ローダー・環境対策</span></div><div><b>PSA候補</b><span>鑑定前保管</span></div><div><b>PSA済み</b><span>専用収納</span></div></section>

  <section className="storageTiers">
   <Step level="LEVEL 1" title="通常カード" summary="まずはスリーブ">
    <p>裸のまま重ねず、サイズの合うスリーブで表面の擦れ・指紋・汚れを防ぐのが基本。頻繁に見返すカードも出し入れを減らせます。</p>
    <A href="https://link.amazon/B05QqCBV6">基本のスリーブをAmazonで確認 →</A>
   </Step>
   <Step level="LEVEL 2" title="少し価値があるカード" summary="スリーブ＋硬質ケース">
    <p>相場が上がってきたカード、初版・プロモ・お気に入りは、スリーブの上から硬質ケースやローダーへ。角や折れへの保護を一段上げます。</p>
    <A href="https://link.amazon/B0etIAWiI">保護用ローダーを確認 →</A>
   </Step>
   <Step level="LEVEL 3" title="高額カード" summary="ローダー＋湿気・紫外線対策">
    <p>高額カードは物理的な保護だけでなく保管場所も重要。直射日光を避け、湿度変化の大きい場所に放置しない。長期保管では防湿環境も選択肢です。</p>
    <A href="https://amzn.to/4rkYuJW">防湿保管用品を確認 →</A>
   </Step>
   <Step level="LEVEL 4" title="PSA候補カード" summary="鑑定前は状態維持を優先">
    <p>鑑定候補は、表面を擦ったり角を傷めたりする出し入れを減らすことが最優先。状態確認後は清潔なスリーブと適切な保護ケースで保管し、無理なクリーニングや加工は避けます。</p>
    <div className="storageLinks"><a href="/psa-simulator">PSA提出期待値を計算する →</a><a href="/psa">NARUTO PSA実績を見る →</a></div>
   </Step>
   <Step level="LEVEL 5" title="PSA鑑定品" summary="スラブ対応収納へ">
    <p>鑑定後はカード自体には触れにくくなりますが、スラブの擦れ・落下・日焼け・湿気への対策は必要。枚数が増えたらPSAサイズに対応したケースや収納でまとめます。</p>
    <A href="https://link.amazon/B06uxlbxz">カード収納用品を確認 →</A>
   </Step>
  </section>

  <section className="storagePrinciple"><h2>商品より先に、保管レベルを決める。</h2><p>カードの価格だけでなく、再入手しやすさ、思い入れ、PSA提出予定も含めて保管方法を選びます。用品を増やすこと自体が目的ではありません。</p><a href="/guide/card-storage">保管方法をさらに詳しく読む →</a></section>
  <p className="guideNote">商品リンクの一部にAmazonアソシエイトリンクを使用しています。価格・在庫・仕様はリンク先でご確認ください。</p>
  <footer>非公式ファンデータベース / 保管方法は一般的な目安で、カードの状態維持や鑑定結果を保証するものではありません。</footer>
 </main>
}