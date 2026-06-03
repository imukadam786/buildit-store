import { ShieldIcon, StoreIcon, TruckIcon, WhatsAppIcon } from "./icons";

const items = [
  { icon: TruckIcon, title: "Delivery to site", text: "Bulk & heavy goods, priced by area" },
  { icon: StoreIcon, title: "Click & collect", text: "Ready at your selected store" },
  { icon: ShieldIcon, title: "Secure payment", text: "Card & instant EFT" },
  { icon: WhatsAppIcon, title: "WhatsApp help", text: "Chat to your store directly" },
];

export function TrustBar() {
  return (
    <section className="border-y border-line bg-surface" aria-label="Why shop with us">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px px-4 py-4 sm:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3 px-2 py-1">
            <Icon className="h-7 w-7 text-brand" />
            <div className="leading-tight">
              <p className="text-sm font-semibold text-ink">{title}</p>
              <p className="text-xs text-muted">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
