const COOKIE_NAME = 'downloaded';
const SIXTY_DAYS_IN_MS = 60 * 24 * 60 * 60 * 1000;

export function setDownloadedCookie(values) {
  const expires = new Date(Date.now() + SIXTY_DAYS_IN_MS).toUTCString();
  document.cookie = `${COOKIE_NAME}=${values.join(',')};expires=${expires};path=/;SameSite=Lax`;
}

export function getDownloadedCookie() {
  const match = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${COOKIE_NAME}=`));

  if (!match) {
    return [];
  }

  const savedValues = match.split('=')[1];
  return savedValues ? savedValues.split(',').filter(Boolean) : [];
}

export function clearDownloadedCookie() {
  document.cookie = `${COOKIE_NAME}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;SameSite=Lax`;
}
