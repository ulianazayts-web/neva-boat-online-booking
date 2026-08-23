const MOSCOW_TIME_ZONE = "Europe/Moscow";

function parts(date) {
  return Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: MOSCOW_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).formatToParts(date).filter((part) => part.type !== "literal").map((part) => [part.type, part.value]),
  );
}

export function moscowDateKey(date = new Date()) {
  const value = parts(date);
  return `${value.year}-${value.month}-${value.day}`;
}

export function moscowNowMinutes(date = new Date()) {
  const value = parts(date);
  return Number(value.hour) * 60 + Number(value.minute);
}

export function addDays(dateKey, amount) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount, 12));
  return date.toISOString().slice(0, 10);
}

export function formatDate(dateKey, options = {}) {
  return new Intl.DateTimeFormat("ru-RU", {
    timeZone: MOSCOW_TIME_ZONE,
    day: "numeric",
    month: "long",
    ...options,
  }).format(new Date(`${dateKey}T12:00:00+03:00`));
}

export function formatDateLabel(dateKey, today = moscowDateKey()) {
  if (dateKey === today) return `Сегодня, ${formatDate(dateKey)}`;
  if (dateKey === addDays(today, 1)) return `Завтра, ${formatDate(dateKey)}`;
  const weekday = new Intl.DateTimeFormat("ru-RU", { timeZone: MOSCOW_TIME_ZONE, weekday: "long" })
    .format(new Date(`${dateKey}T12:00:00+03:00`));
  return `${weekday[0].toUpperCase()}${weekday.slice(1)}, ${formatDate(dateKey)}`;
}

export function getDateOptions(days = 21, now = new Date()) {
  const today = moscowDateKey(now);
  return Array.from({ length: days }, (_, index) => {
    const value = addDays(today, index);
    return { value, label: formatDateLabel(value, today) };
  });
}

export function endTimeLabel(start, duration) {
  const [hours, minutes] = start.split(":").map(Number);
  const total = hours * 60 + minutes + duration * 60;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

export { MOSCOW_TIME_ZONE };
