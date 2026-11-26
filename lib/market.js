import {tournamentPromos} from "./tournamentPromos.js";

// 大会プロモ5枚：SOLD単価は検証リンク付きの資料のみ。未確認カードには金額を作らない。
const tournamentMarketUpdates=Object.fromEntries(
 tournamentPromos.filter(p=>p.marketCheckedAt).map(p=>[p.id,{
  soldCount:p.sales?.length||0,
  market:p.marketSummary,
  confidence:p.sales?.length?"個別SOLD表示確認済み（状態混在）":"同番号SOLD未確認",
  checkedAt:p.marketCheckedAt+" JST"
 }])
);

// Public-safe market snapshot. Raw research notes and item URLs remain private.
export const marketData={
 ...tournamentMarketUpdates,
 "忍-204": {
  "soldCount": 7,
  "market": "単品SOLD 7標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-05 04:26 JST"
 },
 "忍-372": {
  "soldCount": 27,
  "market": "単品SOLD 27件の中央値 ¥22,500（幅 ¥8,277〜55,000）。赤箔／青箔／SRの仕様差を分離できていない混合中央値で、赤箔・SRが高値側。鑑定品（ARS9 ¥55,000・1件）は別枠。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定・仕様混合）",
  "checkedAt": "2026-11-26 JST"
 },
 "PR術-2": {
  "soldCount": 7,
  "market": "単品SOLD 7標本を確認。高額な不確実標本は別枠とし、混合集計していません。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 23:44 JST"
 },
 "忍-1": {
  "soldCount": 11,
  "market": "単品SOLD 11標本を確認。8,000円台〜40,000円の成約例があり、状態差による価格幅が大きい。直近確認SOLDは18,200円（2026年9月29日）。状態別の実売を継続追跡中。",
  "confidence": "複数SOLD確認済み",
  "checkedAt": "2026-10-05 21:12 JST"
 },
 "忍-2": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-3": {
  "soldCount": 34,
  "market": "単品SOLD 34件の中央値 ¥6,550（幅 ¥630〜35,000）。価格幅が非常に大きく、両端は外れ値候補。PR忍-3／OP忍-3は別型番として除外。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-136": {
  "soldCount": 3,
  "market": "単品SOLD 3標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-137": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-144": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-145": {
  "soldCount": 21,
  "market": "単品SOLD 21件の中央値 ¥1,800（幅 ¥300〜11,000）。忍-295とは別カード。鑑定品（グレード9.5・$179・1件）は別枠。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-146": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-151": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-152": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-153": {
  "soldCount": 3,
  "market": "単品SOLD 3標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-154": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-186": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-189": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-191": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-192": {
  "soldCount": 3,
  "market": "単品SOLD 3標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-205": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-206": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-212": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-217": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-218": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-219": {
  "soldCount": 3,
  "market": "単品SOLD 3標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-220": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-221": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-222": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-255": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-256": {
  "soldCount": 3,
  "market": "単品SOLD 3標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-257": {
  "soldCount": 3,
  "market": "単品SOLD 3標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-258": {
  "soldCount": 2,
  "market": "単品SOLD 2標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-259": {
  "soldCount": 4,
  "market": "2026年10月13日に根拠URLを照合した単品SOLD表示4件は2,444円（折れあり）、25,611円（Yahoo!落札）、50,000円（未使用に近い）、100,000円（美品表記）。傷・加工・状態差が極めて大きいため、4件の中央値や平均を適正相場として公表しない。過去のSOLD標本3件と重複の可能性があるため合算しない。30,000円のメルカリ出品は未成約のASKとして別枠。",
  "confidence": "URL付きSOLD表示4件・状態別比較未完了",
  "checkedAt": "2026-10-13 JST"
 },
 "忍-262": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 11:59 JST"
 },
 "忍-11": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-16": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-17": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-18": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-19": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-20": {
  "soldCount": 10,
  "market": "UR・キラ・ホロ表記の単品SOLD表示候補10件（2,999〜103,000円）。加工・状態の厳密一致が未確認のため同仕様中央値は算出保留。",
  "confidence": "番号・UR等表記一致のSOLD表示候補10件。厳密同仕様未照合",
  "checkedAt": "2026-10-24 JST"
 },
 "忍-21": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-22": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-23": {
  "soldCount": 20,
  "market": "単品SOLD 20件の中央値 ¥4,400（幅 ¥926〜17,000）。¥13,000の1件は鑑定品か未確認で、除外しても中央値 ¥4,300 とほぼ同水準。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-24": {
  "soldCount": 17,
  "market": "単品SOLD 17件の中央値 ¥1,600（幅 ¥400〜3,100）。販路はメルカリ中心。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-25": {
  "soldCount": 7,
  "market": "単品SOLD 7件の中央値 ¥1,200（幅 ¥760〜2,000）。確認単品はBANDAI 2003／2004表記で、2002表記の単品は未確認。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-26": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-27": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-30": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-31": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-33": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-67": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-68": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-69": {
  "soldCount": 1,
  "market": "単品SOLD 1標本を確認。版・加工・状態を統一できるまで中央値・単一相場は保留。",
  "confidence": "個別SOLD確認済み",
  "checkedAt": "2026-10-04 12:02 JST"
 },
 "忍-333": {
  "soldCount": 29,
  "market": "単品SOLD 29件の中央値 ¥3,000（幅 ¥450〜8,900）。安値側はダメージ有り等の状態差が目立つ。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-43": {
  "soldCount": 40,
  "market": "単品SOLD 40件の中央値 ¥3,317（幅 ¥400〜26,000）。ヤフオク ¥26,000 は高値外れ値で、除外しても ¥3,300。フリマは ¥8,000〜12,000 と高め。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-129": {
  "soldCount": 34,
  "market": "国内単品SOLD 34件の中央値 ¥10,590（幅 ¥1,800〜33,000）。eBay日本版は大幅に安く別枠。自販機版（¥4,980・1件）は別カテゴリ。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定・国内標本）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-295": {
  "soldCount": 7,
  "market": "単品SOLD 7件の中央値 ¥1,000（幅 ¥850〜1,800）。メルカリのみに集中。鑑定品3件（グレード要検証）は別枠。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-223": {
  "soldCount": 12,
  "market": "単品SOLD 12件の中央値 ¥890（幅 ¥500〜2,980）。メルカリのみ。ヤフオク・eBay日本版の単品成約なし。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-4": {
  "soldCount": 5,
  "market": "単品SOLD 5件の中央値 ¥980（幅 ¥500〜1,900）。件数が少ないため暫定値。メルカリのみ。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定・暫定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-7": {
  "soldCount": 7,
  "market": "単品SOLD 7件の中央値 ¥600（幅 ¥300〜777）。メルカリのみ。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 },
 "忍-12": {
  "soldCount": 8,
  "market": "単品SOLD 8件の中央値 ¥840（幅 ¥231〜1,000）。ヤフオク分は同一ストアの繰り返し出品。",
  "confidence": "複数SOLD確認済み（週次集計で中央値確定）",
  "checkedAt": "2026-11-26 JST"
 }
};
export function getMarketData(id){return marketData[id]||null;}
export const marketDataCount=Object.keys(marketData).length;