"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type BookingState = {
  checkIn: string;
  checkOut: string;
  guests: number;
  setCheckIn: (date: string) => void;
  setCheckOut: (date: string) => void;
  setGuests: (guests: number) => void;
  clearDates: () => void;
};

const BookingContext = createContext<BookingState | null>(null);

// Shares the selected dates and guest count between the booking card and the
// calendar on a listing page.
export function BookingProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckInRaw] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  const value = useMemo<BookingState>(
    () => ({
      checkIn,
      checkOut,
      guests,
      setCheckIn: (date) => {
        setCheckInRaw(date);
        // Keep the range valid when the new check-in lands on/after checkout.
        if (checkOut && date >= checkOut) setCheckOut("");
      },
      setCheckOut,
      setGuests,
      clearDates: () => {
        setCheckInRaw("");
        setCheckOut("");
      },
    }),
    [checkIn, checkOut, guests],
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
