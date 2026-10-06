import { brandPaths, type BrandIcon as BrandName } from "@/lib/brand-icons";

export function BrandIcon({ name, className }: { name: BrandName; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d={brandPaths[name]} />
    </svg>
  );
}
