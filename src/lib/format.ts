import { site } from "@/data/site";

export function formatPrice(amount: number) {
  return `${site.currency} ${amount.toLocaleString("en-KE")}`;
}

export function nightsBetween(checkIn?: string, checkOut?: string) {
  if (!checkIn || !checkOut) return 0;
  const ms = new Date(`${checkOut}T00:00:00`).getTime() - new Date(`${checkIn}T00:00:00`).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

export function plural(count: number, word: string, pluralWord = `${word}s`) {
  return `${count} ${count === 1 ? word : pluralWord}`;
}
