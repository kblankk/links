import { useEffect, useRef } from "react";
import { Particles } from "@/components/ui/particles";

export function Background({ dark }: { dark: boolean }) {
  const glowRef = useRef<HTMLDivElement>(null);

  // Soft cursor glow over the whole page (mouse/trackpad only).
  useEffect(() => {
    const el = glowRef.current;
    if (!el || !window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
        el.style.opacity = "1";
      });
    };
    const onLeave = () => (el.style.opacity = "0");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />

      <div className="absolute top-[-20rem] left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 opacity-70 dark:opacity-100">
        <div className="absolute inset-0 animate-aurora-a rounded-full bg-[radial-gradient(circle,rgb(0_150_255/0.38),transparent_62%)] blur-3xl" />
        <div className="absolute inset-[12%] animate-aurora-b rounded-full bg-[radial-gradient(circle,rgb(0_212_255/0.28),transparent_62%)] blur-3xl" />
      </div>
      <div className="absolute right-[-12rem] bottom-[-14rem] h-[28rem] w-[28rem] animate-aurora-b rounded-full bg-[radial-gradient(circle,rgb(0_150_255/0.12),transparent_65%)] blur-3xl" />

      <Particles className="absolute inset-0" color={dark ? "165 212 255" : "0 105 210"} />

      <div
        ref={glowRef}
        className="absolute inset-0 opacity-0 transition-opacity duration-700"
        style={{ background: "radial-gradient(560px circle at var(--mx) var(--my), var(--glow), transparent 60%)" }}
      />
      <div className="bg-noise absolute inset-0 opacity-[0.04] mix-blend-overlay dark:opacity-[0.06]" />
    </div>
  );
}
