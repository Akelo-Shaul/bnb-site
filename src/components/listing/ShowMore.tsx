"use client";

import { useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

// Clamps long text to a few lines with a "Show more" toggle.
export function ShowMore({ children, lines = 4 }: { children: ReactNode; lines?: 3 | 4 }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className={open ? "" : lines === 3 ? "line-clamp-3" : "line-clamp-4"}>{children}</div>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="mt-4 flex items-center gap-1 text-sm font-semibold underline"
      >
        {open ? "Show less" : "Show more"}
        <Icon name="chevronRight" className={`size-3.5 transition-transform ${open ? "-rotate-90" : ""}`} strokeWidth={2} />
      </button>
    </div>
  );
}
