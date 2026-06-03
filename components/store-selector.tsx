"use client";

import { useState } from "react";
import { useStoreSelection } from "./providers";
import { StoreIcon } from "./icons";

/** Compact "shopping at" control. The customer picks one store and it sticks. */
export function StoreSelector({ tone = "light" }: { tone?: "light" | "dark" }) {
  const { store, stores, setStoreId } = useStoreSelection();
  const [open, setOpen] = useState(false);
  const text = tone === "dark" ? "text-white" : "text-ink";

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 text-sm ${text} hover:text-brand`}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <StoreIcon className="h-4 w-4" />
        <span className="hidden sm:inline">Shopping at</span>
        <span className="font-semibold">{store.name}</span>
        <span aria-hidden>▾</span>
      </button>

      {open && (
        <>
          <button className="fixed inset-0 z-10 cursor-default" aria-hidden onClick={() => setOpen(false)} tabIndex={-1} />
          <ul
            role="listbox"
            className="absolute left-0 z-20 mt-2 w-64 rounded-lg border border-line bg-surface p-1 text-ink shadow-lg"
          >
            {stores.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={s.id === store.id}
                  onClick={() => {
                    setStoreId(s.id);
                    setOpen(false);
                  }}
                  className={`flex w-full flex-col rounded-md px-3 py-2 text-left hover:bg-canvas ${
                    s.id === store.id ? "bg-brand-tint" : ""
                  }`}
                >
                  <span className="text-sm font-semibold">{s.name}</span>
                  <span className="text-xs text-muted">{s.area}</span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
