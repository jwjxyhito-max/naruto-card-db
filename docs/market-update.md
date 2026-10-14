# NARUTO相場分析の保存経路

通常の相場更新はGitHub変更・Vercel再デプロイを使わない。

1. 既存の朝夜調査がSupabase管理OAuth接続で `select private.begin_naruto_market_run();` を呼ぶ。
2. `started` の場合のみ調査し、返された `run_id` と `base_analysis_id` を保持する。同じJST朝・夜枠の二重調査は開始しない。
3. 最新の正常な保存分析を読み、Mercariの番号・加工・版・単品/セット・状態を照合。成約表示とASKを分け、SOLDのURL・標本数・中央値を検証する。eBayのASKから国内上昇を判定しない。
4. 新しく検証できた有意義な変化だけを、既存8フィールドのpayloadと別添のevidenceで `private.submit_naruto_market_run` へ渡す。
5. DBがpayloadと差分根拠を検証し、専用キューへ保存。DB発行の期限付き256bitジョブチケットを付け、pg_netから `naruto-market-update` Edge Functionを呼ぶ。
6. Edge Functionは任意payloadを受け付けず、ジョブIDとチケットだけを受け付ける。サーバー内のサービスロールで、公開実行権限を剥奪した `naruto_consume_market_job` を呼ぶ。
7. DB内でチケット、期限、基準分析ID、payload、差分、ハッシュを再検証し、直列化したトランザクションでpayloadのみINSERT。`analyzed_at` は既存DBデフォルト `now()` を使う。
8. 保存結果を読み戻し、トップと `/analysis` の `data-analysis-id` が保存IDと一致すること、カード名・価格・中央値が一致することを確認する。

キューの再送は5分間隔、最大5回。これは保存の再送で、相場調査の増便ではない。失敗時は既存公開データを保持する。RLSは有効のままで、公開ロールはSELECTのみ。新しいDB関数はすべてSECURITY INVOKER。

## 呼び出し

Supabase project: `triyddjhfrmhyxxnilyq`。Supabase接続ツールの安全審査は継続して適用する。拒否された操作を別のツールやSQL表現で強行しない。

```sql
select private.begin_naruto_market_run();
select id,payload,analyzed_at from public.naruto_market_analysis
where private.naruto_market_payload_valid(payload,false)
order by analyzed_at desc,id desc limit 1;
```

更新時は以下に実際に検証したJSONを渡す。単一引用符は必ず2個にエスケープする。時刻・idをpayloadに追加しない。

```sql
select private.submit_naruto_market_run(
  p_run_id := '<beginで返されたUUID>'::uuid,
  p_payload := '<検証済み8フィールドJSON>'::jsonb,
  p_evidence := '<根拠配列JSON>'::jsonb
);
```

変化なしなら `p_payload := null, p_evidence := '[]'::jsonb`。調査失敗なら同じ呼び出しに `p_error := 'research: ...'` を加える。DB保存を成功と報告できるのは `saved` と読み戻しを確認した場合だけ。

```sql
select slot,status,started_at,finished_at,result from private.naruto_market_runs order by started_at desc limit 5;
select id,status,attempts,finished_at,result from private.naruto_market_jobs where run_id='<UUID>'::uuid;
```

`ticket` 列は読まない・出力しない。秘密鍵の取得・配布は不要。

## evidence

すべての要素に `type`, `url`, `observedAt`（24時間以内のISO日時）, `verified:true`, `summary` を付ける。未確認情報にverifiedを付けない。検索スニペットだけで確認済みにしない。

- `official`: 許可された公式ホストの本文を読み、短い `excerpt` を保持する。同じURLが既存catalystsにあれば既報。新しいURLをcatalystsへ追加し、カード数値・順位は再検証せずに変更しない。
- `price`: `cardId`, `metric`（ask/sold_median）, `numberMatched`, `specMatched`, `conditionMatched`, `singleCard` を付ける。4つの照合フラグをすべて本文・写真で確認する。大幅変動は20%以上。同じ出品のASKは `available:true` を付け、旧・新mercariUrlが同一のときだけ採用する。
- SOLD中央値の変更: `samples` に重複しないURL・`priceYen`・`soldConfirmed` と4照合フラグを付ける。最低3件でDBが中央値・標本数を再計算し、payloadのmedian/samplesと一致しない入力を採用しない。少数標本や比較条件変更を市場上昇扱いしない。
- `ranking`: `cardId` と4照合フラグを付け、順位変更の具体的な根拠をsummaryへ記録。価格の記述を変更する場合は、別のprice根拠も保持する。
- `sold_out`: `cardId`, `soldConfirmed:true` を付け、同一出品の成約または明確な販売終了を本文で確認。取得失敗・削除・404をSOLDとしない。judgeに売り切れ/SOLD/販売終了を明記する。

公式の既存ページ改訂だけの場合はURL重複チェックで保留する。重要な訂正は新しい公式発表URLを確認するまで自動保存しない。

## 表示とテスト

トップと相場ページはサーバーで毎回DBを読む。fetchはno-store。最新の不正なpayloadは飛ばし、直近50行の正常データから表示する。通信失敗時はプロセス内の最後の正常データ、または最終確認済みの同梱スナップショットを使う。公開経過時間だけで相場更新を捏造しない。

`npm test` は入力・認証・通信失敗・正常データ保持・金額の小数処理を検証。`supabase/test-naruto-market-update.sql` は実INSERTと読み戻し、DB時刻、同じチケットの再送、重複・変化なし・不正形式の拒否を検証し、全テスト書き込みを必ずロールバックする。偽相場を公開履歴にコミットしない。

通知は順位変更、大幅な価格変動、重要な売り切れ、重要公式発表、DB保存/サイト反映失敗のみ。変化なし、既報のみ、単なる再送完了は通知しない。
