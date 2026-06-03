"use client";

import { useEffect, useState } from "react";

// Minimal POPIA-style consent notice (South African privacy law). Front-end
// placeholder — the choice is remembered locally; wiring it to real analytics
// consent happens with the admin/analytics work later.
const KEY = "bi.consent";

export function PopiaBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  function decide(value: "accepted" | "declined") {
    try {
      localStorage.setItem(KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
        <p className="flex-1 text-sm text-ink">
          We use cookies to run the store and understand how it&apos;s used, in line with our{" "}
          <a href="/privacy" className="font-semibold text-brand underline">privacy policy</a>. You can accept or decline non-essential cookies.
        </p>
        <div className="flex gap-2">
          <button onClick={() => decide("declined")} className="rounded-md border border-line px-4 py-2 text-sm font-medium text-ink hover:bg-canvas">
            Decline
          </button>
          <button onClick={() => decide("accepted")} className="rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
