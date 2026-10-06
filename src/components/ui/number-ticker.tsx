import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "motion/react";
import { cn, prefersReducedMotion } from "@/lib/utils";

const format = new Intl.NumberFormat("pt-BR");

export function NumberTicker({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 38, stiffness: 110 });
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion()) {
      if (ref.current) ref.current.textContent = format.format(value);
      return;
    }
    motionValue.set(value);
  }, [inView, value, motionValue]);

  useEffect(
    () =>
      spring.on("change", (v) => {
        if (ref.current) ref.current.textContent = format.format(Math.round(v));
      }),
    [spring],
  );

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      0
    </span>
  );
}
