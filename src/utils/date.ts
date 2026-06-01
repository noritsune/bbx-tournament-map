/** "2026/06/07 13:00:00" または "2026/06/07" → "2026年6月7日（日）" */
export function formatDate(dateStr: string): string {
  const d = new Date(dateStr.replace(/\//g, '-'));
  return d.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' });
}

/** "2026/06/07 13:00:00" → "13:00" / 時刻なしなら空文字 */
export function formatTime(dateStr: string): string {
  const timePart = dateStr.includes(' ') ? dateStr.split(' ')[1] : '';
  if (!timePart || timePart === '00:00:00') return '';
  return timePart.slice(0, 5);
}

export function isUpcoming(dateStr: string): boolean {
  return new Date(dateStr.replace(/\//g, '-')) >= new Date(new Date().toDateString());
}
