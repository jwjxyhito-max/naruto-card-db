export function officialDate(row) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(row.published_date || '')) return row.published_date;
  if (row.published_at && Number.isFinite(Date.parse(row.published_at))) return row.published_at;
  return null;
}

export function normalizeNewsRows(rows, limit = 20) {
  return rows.slice().sort((a, b) => {
    const aDate = officialDate(a), bDate = officialDate(b);
    return Number(Boolean(bDate)) - Number(Boolean(aDate)) ||
      Date.parse(bDate || b.captured_at) - Date.parse(aDate || a.captured_at) || b.id - a.id;
  }).slice(0, limit).map(row => {
    const value = officialDate(row);
    const date = value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(value + 'T00:00:00+09:00') : value && new Date(value);
    return { ...row, publishedLabel: date ? new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date) : '公開日未確認' };
  });
}
