/**
 * Форматирует секунды в строку MM:SS или H:MM:SS, если больше часа.
 * @param totalSeconds - время в секундах (отрицательное → "0:00")
 * @returns строка вида "5:30" или "1:05:30"
 */
export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;

  const mm = hours > 0 ? minutes.toString().padStart(2, '0') : minutes.toString();
  const ss = seconds.toString().padStart(2, '0');

  return hours > 0 ? `${hours}:${mm}:${ss}` : `${mm}:${ss}`;
}