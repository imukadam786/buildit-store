// Lightweight inline SVG icons (no icon library dependency — keeps the bundle
// small for mobile-data shoppers). All are 1em-sized and inherit currentColor.

type IconProps = { className?: string };

const base = "inline-block shrink-0";

export function CartIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`${base} ${className}`} aria-hidden>
      <circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h2.2l2.2 12.4a1.6 1.6 0 0 0 1.6 1.3h8.7a1.6 1.6 0 0 0 1.6-1.3L21 7H5.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SearchIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`${base} ${className}`} aria-hidden>
      <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

export function WhatsAppIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={`${base} ${className}`} aria-hidden>
      <path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.4A10 10 0 1 0 12 2Zm5.6 14.2c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .1-3.2-.9-2.7-1.2-4.4-4-4.5-4.2-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .5l-.4.6c-.2.2-.3.4-.1.6.5.9 1 1.3 1.8 1.9.7.4.9.4 1.1.2l.6-.7c.2-.3.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.2.1.6 0 1.1Z" />
    </svg>
  );
}

export function TruckIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`${base} ${className}`} aria-hidden>
      <path d="M2 6h11v9H2zM13 9h4l3 3v3h-7z" strokeLinejoin="round" />
      <circle cx="6.5" cy="17.5" r="1.6" /><circle cx="17" cy="17.5" r="1.6" />
    </svg>
  );
}

export function StoreIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`${base} ${className}`} aria-hidden>
      <path d="M4 9h16v10H4zM3 9l1.5-5h15L21 9M9 19v-5h6v5" strokeLinejoin="round" />
    </svg>
  );
}

export function ShieldIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={`${base} ${className}`} aria-hidden>
      <path d="M12 3 5 6v5c0 4 3 7 7 9 4-2 7-5 7-9V6l-7-3Z" strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function StarIcon({ className = "", filled = true }: IconProps & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" className={`${base} ${className}`} aria-hidden>
      <path d="m12 3 2.6 5.3 5.9.9-4.2 4.1 1 5.8L12 16.9 6.7 19.2l1-5.8L3.5 9.2l5.9-.9Z" strokeLinejoin="round" />
    </svg>
  );
}

// Category icons keyed by Category.icon.
export function CategoryIcon({ name, className = "" }: { name: string; className?: string }) {
  const common = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.6", className: `${base} ${className}`, "aria-hidden": true } as const;
  switch (name) {
    case "drill":
      return (<svg {...common}><path d="M4 8h9v5H4zM13 9h4v3h-4zM6 13v4h3v-4M17 10h3v2h-3" strokeLinejoin="round" strokeLinecap="round" /></svg>);
    case "brick":
      return (<svg {...common}><path d="M3 7h18M3 12h18M3 17h18M7 7v5M14 7v5M10 12v5M17 12v5" strokeLinecap="round" /></svg>);
    case "paint":
      return (<svg {...common}><path d="M4 4h13v6H4zM17 6h3v4l-4 2v3M11 16v4" strokeLinejoin="round" strokeLinecap="round" /><circle cx="11" cy="22" r="0.5" /></svg>);
    case "pipe":
      return (<svg {...common}><path d="M5 8h6v8H5zM11 5h8v6h-8M19 5v3M16 5v3" strokeLinejoin="round" strokeLinecap="round" /></svg>);
    case "shower":
      return (<svg {...common}><path d="M12 3a4 4 0 0 1 4 4M16 7H8a3 3 0 0 0-3 3h14a3 3 0 0 0-3-3ZM8 14v1M12 14v2M16 14v1" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    case "leaf":
      return (<svg {...common}><path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14ZM5 19c4-4 7-6 10-7" strokeLinecap="round" strokeLinejoin="round" /></svg>);
    default:
      return (<svg {...common}><rect x="4" y="4" width="16" height="16" rx="2" /></svg>);
  }
}
