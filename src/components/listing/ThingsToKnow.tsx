import type { Property } from "@/data/properties";
import { Icon } from "@/components/ui/Icon";

export function ThingsToKnow({ property }: { property: Property }) {
  const columns = [
    { title: "House rules", items: property.houseRules },
    { title: "Safety & property", items: property.safety },
  ];

  return (
    <section className="py-10">
      <h2 className="text-[22px] font-semibold">Things to know</h2>
      <div className="mt-6 grid gap-10 md:grid-cols-3">
        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="font-semibold">{col.title}</h3>
            <ul className="mt-4 space-y-3 text-[15px]">
              {col.items.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <Icon name={item.icon} className="mt-0.5 size-5 shrink-0" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h3 className="font-semibold">Cancellation policy</h3>
          <p className="mt-4 text-[15px]">{property.cancellation}</p>
        </div>
      </div>
    </section>
  );
}
