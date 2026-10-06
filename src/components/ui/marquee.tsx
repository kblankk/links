import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  duration?: string;
  gap?: string;
};

/** Seamless infinite marquee: two identical tracks, the second hidden from AT. Pauses on hover. */
export function Marquee({ children, className, duration = "36s", gap = "0.625rem" }: Props) {
  const style = { "--gap": gap, "--marquee-duration": duration, gap: "var(--gap)" } as CSSProperties;
  return (
    <div className={cn("group flex overflow-hidden", className)} style={style}>
      {[0, 1].map((track) => (
        <div
          key={track}
          aria-hidden={track === 1 || undefined}
          className="flex shrink-0 animate-marquee items-center group-hover:[animation-play-state:paused]"
          style={{ gap: "var(--gap)" }}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
