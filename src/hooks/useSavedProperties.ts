"use client";

import { useCallback, useSyncExternalStore } from "react";

const KEY = "saved-properties";
const listeners = new Set<() => void>();

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? "[]";
  } catch {
    return "[]";
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

// Hearted properties, remembered in this browser only.
export function useSavedProperties() {
  const raw = useSyncExternalStore(subscribe, read, () => "[]");
  const saved: string[] = JSON.parse(raw);

  const toggle = useCallback((slug: string) => {
    const current: string[] = JSON.parse(read());
    const next = current.includes(slug) ? current.filter((s) => s !== slug) : [...current, slug];
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Storage unavailable (private mode); the heart just won't persist.
    }
    listeners.forEach((l) => l());
  }, []);

  return { isSaved: (slug: string) => saved.includes(slug), toggle };
}
