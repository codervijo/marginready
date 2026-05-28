import { Check } from "lucide-react";

export function TrustChecklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
          <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-profit-soft text-profit">
            <Check className="h-3 w-3" strokeWidth={3} />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
