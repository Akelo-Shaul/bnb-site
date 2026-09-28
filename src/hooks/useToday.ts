"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};

function localTodayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

/**
 * Today's date as YYYY-MM-DD in the visitor's timezone. Returns "" during
 * server render/hydration so statically built pages never bake in the build date.
 */
export function useToday() {
  return useSyncExternalStore(noopSubscribe, localTodayIso, () => "");
}
