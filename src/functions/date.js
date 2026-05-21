const HONG_KONG_TIMEZONE = 'Asia/Hong_Kong';
const HOUR_IN_MS = 60 * 60 * 1000;
const DAY_IN_MS = 24 * HOUR_IN_MS;

export function formatHongKongTimestamp(isoDateString) {
  if (!isoDateString) {
    return '--';
  }

  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  return new Intl.DateTimeFormat('zh-HK', {
    timeZone: HONG_KONG_TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date).replace(',', '') + ' HKT';
}

export function formatRelativeTimeFromNow(isoDateString) {
  if (!isoDateString) {
    return '--';
  }

  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) {
    return '--';
  }

  const diffInMs = date.getTime() - Date.now();
  const rtf = new Intl.RelativeTimeFormat('zh-HK', { numeric: 'auto' });

  if (Math.abs(diffInMs) < DAY_IN_MS) {
    return rtf.format(Math.round(diffInMs / HOUR_IN_MS), 'hour');
  }

  return rtf.format(Math.round(diffInMs / DAY_IN_MS), 'day');
}
