"use client";

import { useState } from "react";
import { useBooking } from "@/hooks/useBooking";
import { useToday } from "@/hooks/useToday";
import { formatDate } from "@/lib/contact";
import { nightsBetween, plural } from "@/lib/format";
import { Icon } from "@/components/ui/Icon";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function iso(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function Month({ year, month, today }: { year: number; month: number; today: string }) {
  const { checkIn, checkOut, setCheckIn, setCheckOut } = useBooking();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const label = new Date(year, month, 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

  function pick(date: string) {
    if (!checkIn || checkOut || date <= checkIn) {
      setCheckIn(date);
      setCheckOut("");
    } else {
      setCheckOut(date);
    }
  }

  return (
    <div>
      <p className="mb-4 text-center font-semibold">{label}</p>
      <div className="grid grid-cols-7 text-center text-xs text-muted">
        {WEEKDAYS.map((d) => (
          <span key={d} className="pb-2">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 text-center text-sm">
        {Array.from({ length: firstWeekday }, (_, i) => (
          <span key={`pad-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const date = iso(year, month, i + 1);
          const past = date < today;
          const isEnd = date === checkIn || date === checkOut;
          const inRange = checkIn && checkOut && date > checkIn && date < checkOut;
          return (
            <div key={date} className={`py-0.5 ${inRange ? "bg-[#f7f7f7]" : ""}`}>
              <button
                type="button"
                disabled={past}
                onClick={() => pick(date)}
                aria-pressed={isEnd}
                aria-label={formatDate(date)}
                className={`mx-auto grid size-10 place-items-center rounded-full ${
                  isEnd ? "bg-black text-white" : past ? "text-[#b0b0b0] line-through" : "hover:ring-1 hover:ring-black"
                }`}
              >
                {i + 1}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function AvailabilityCalendar({ town }: { town: string }) {
  const { checkIn, checkOut, clearDates } = useBooking();
  const today = useToday();
  const [offset, setOffset] = useState(0);
  const [y, m] = today ? today.split("-").map(Number) : [0, 1];
  const first = new Date(y, m - 1 + offset, 1);
  const second = new Date(y, m + offset, 1);
  const nights = nightsBetween(checkIn, checkOut);

  return (
    <section className="border-b border-line py-10">
      <h2 className="text-[22px] font-semibold">
        {nights > 0 ? `${plural(nights, "night")} in ${town}` : "Select check-in date"}
      </h2>
      <p className="mt-1 text-sm text-muted">
        {checkIn && checkOut
          ? `${formatDate(checkIn)} – ${formatDate(checkOut)}`
          : "Pick your dates, then send them to us to confirm availability"}
      </p>

      <div className="relative mt-8">
        <button
          type="button"
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
          disabled={offset === 0}
          aria-label="Previous month"
          className="absolute left-0 top-0 grid size-8 place-items-center rounded-full hover:bg-black/5 disabled:opacity-30"
        >
          <Icon name="chevronLeft" className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => setOffset((o) => o + 1)}
          aria-label="Next month"
          className="absolute right-0 top-0 grid size-8 place-items-center rounded-full hover:bg-black/5"
        >
          <Icon name="chevronRight" className="size-4" />
        </button>
        {today ? (
          <div className="grid gap-10 sm:grid-cols-2">
            <Month year={first.getFullYear()} month={first.getMonth()} today={today} />
            <div className="hidden sm:block">
              <Month year={second.getFullYear()} month={second.getMonth()} today={today} />
            </div>
          </div>
        ) : (
          <div className="h-[330px]" aria-hidden="true" />
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <button type="button" onClick={clearDates} className="text-sm font-semibold underline">
          Clear dates
        </button>
      </div>
    </section>
  );
}
