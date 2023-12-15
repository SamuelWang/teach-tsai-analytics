export function getTodayUtcTimestamp(hour: number = 0) {
  const nowDate = new Date();

  return Date.UTC(
    nowDate.getUTCFullYear(),
    nowDate.getUTCMonth(),
    nowDate.getUTCDate(),
    hour,
    0,
    0,
  );
}
