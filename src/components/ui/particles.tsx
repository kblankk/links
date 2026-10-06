import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/utils";

type Particle = {
  x: number;
  y: number;
  /** Mouse-parallax offset. */
  ox: number;
  oy: number;
  size: number;
  alpha: number;
  peak: number;
  vx: number;
  vy: number;
  magnetism: number;
};

type Props = {
  className?: string;
  /** Upper bound; actual count scales with viewport area. */
  quantity?: number;
  /** Space-separated RGB, e.g. "160 210 255". */
  color: string;
  /** Higher = particles react less to the cursor. */
  staticity?: number;
  /** Higher = slower easing toward the cursor offset. */
  ease?: number;
};

export function Particles({ className, quantity = 80, color, staticity = 50, ease = 60 }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorRef = useRef(color);
  const redrawRef = useRef<() => void>(() => {});

  useEffect(() => {
    colorRef.current = color;
    redrawRef.current();
  }, [color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: 0, y: 0 };
    let w = 0;
    let h = 0;
    let raf = 0;
    let particles: Particle[] = [];

    const spawn = (): Particle => ({
      x: Math.random() * w,
      y: Math.random() * h,
      ox: 0,
      oy: 0,
      size: Math.random() * 1.3 + 0.35,
      alpha: still ? 0.5 : 0,
      peak: Math.random() * 0.5 + 0.15,
      vx: (Math.random() - 0.5) * 0.14,
      vy: (Math.random() - 0.5) * 0.14 - 0.03,
      magnetism: 0.1 + Math.random() * 4,
    });

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Keep existing particles across resizes (mobile URL bar), only top up / trim.
      const target = Math.round(Math.min(quantity, (w * h) / 13000));
      while (particles.length < target) particles.push(spawn());
      particles.length = target;
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const rgb = colorRef.current;
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x + p.ox, p.y + p.oy, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${rgb} / ${p.alpha.toFixed(3)})`;
        ctx.fill();
      }
    };

    const tick = () => {
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const edge = Math.min(p.x, w - p.x, p.y, h - p.y);
        const fade = Math.max(0, Math.min(1, edge / 60));
        p.alpha += (p.peak * fade - p.alpha) * 0.03;
        p.x += p.vx;
        p.y += p.vy;
        p.ox += (mouse.x / (staticity / p.magnetism) - p.ox) / ease;
        p.oy += (mouse.y / (staticity / p.magnetism) - p.oy) / ease;
        if (p.x < -20 || p.x > w + 20 || p.y < -20 || p.y > h + 20) particles[i] = spawn();
      }
      draw();
      raf = requestAnimationFrame(tick);
    };

    const onPointer = (e: PointerEvent) => {
      mouse.x = e.clientX - w / 2;
      mouse.y = e.clientY - h / 2;
    };
    const onVisibility = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden && !still) raf = requestAnimationFrame(tick);
    };
    const onResize = () => {
      resize();
      if (still) draw();
    };

    redrawRef.current = draw;
    resize();
    if (still) draw();
    else raf = requestAnimationFrame(tick);

    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointer, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(raf);
      redrawRef.current = () => {};
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [quantity, staticity, ease]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
