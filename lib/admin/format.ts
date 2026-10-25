export function formatDateTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Melbourne",
  }).format(date);
}

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatVisit(date: string, time: string) {
  const [year, month, day] = date.split("-").map(Number);
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  if (!year || !month || !day) return `${date} ${time}`.trim();
  const suffix = hour >= 12 ? "pm" : "am";
  const hour12 = hour % 12 || 12;
  const minutes = String(minute).padStart(2, "0");
  return `${day} ${months[month - 1] ?? ""} ${year}, ${hour12}:${minutes} ${suffix}`;
}

export function formatChatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const dayKey = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Australia/Melbourne",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  if (dayKey.format(date) === dayKey.format(new Date())) {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone: "Australia/Melbourne",
      hour: "numeric",
      minute: "2-digit",
    }).format(date);
  }

  return new Intl.DateTimeFormat("en-AU", {
    timeZone: "Australia/Melbourne",
    day: "numeric",
    month: "short",
  }).format(date);
}

export function telHref(phone: string) {
  const digits = phone.replace(/[^\d+]/g, "");
  return digits ? `tel:${digits}` : "";
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
