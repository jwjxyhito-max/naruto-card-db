import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeNewsRows } from '../lib/newsFormatting.mjs';

test('official calendar date wins over a later ingestion date', () => {
 const rows = normalizeNewsRows([
  {id:1,published_date:'2026-09-14',published_at:null,captured_at:'2026-10-29T00:00:00Z'},
  {id:2,published_date:'2026-10-23',published_at:null,captured_at:'2026-10-23T01:00:00Z'},
  {id:3,published_date:null,published_at:null,captured_at:'2026-10-30T00:00:00Z'}
 ]);
 assert.deepEqual(rows.map(x=>x.id),[2,1,3]);
 assert.equal(rows[0].publishedLabel,'2026/10/23');
 assert.equal(rows[2].publishedLabel,'公開日未確認');
});
