import { forwardRef, useRef, type ButtonHTMLAttributes } from "react";
import { flushSync } from "react-dom";
import { AnimatePresence, m } from "motion/react";
import { Moon, Share2, Sun } from "lucide-react";
import { profile } from "@/data/profile";
import { useToast } from "@/components/toast";
import { cn, copyText, prefersReducedMotion } from "@/lib/utils";

const IconButton = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { label: string }>(
  ({ label, className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        "relative grid size-9 cursor-pointer place-items-center overflow-hidden rounded-full border border-border bg-card text-muted backdrop-blur-md transition-[color,background-color,border-color,transform] duration-200 hover:border-border-strong hover:bg-card-hover hover:text-foreground active:scale-90",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);
IconButton.displayName = "IconButton";

function ThemeToggle({ dark, onChange }: { dark: boolean; onChange: (dark: boolean) => void }) {
  const ref = useRef<HTMLButtonElement>(null);

  const toggle = async () => {
    const next = !dark;
    const button = ref.current;
    if (typeof document.startViewTransition !== "function" || prefersReducedMotion() || !button) {
      onChange(next);
      return;
    }
    // Circular reveal of the new theme, centred on the button.
    const { left, top, width, height } = button.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(() => flushSync(() => onChange(next)));
    await transition.ready;
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
      { duration: 700, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  };

  return (
    <IconButton ref={ref} onClick={toggle} label={dark ? "Ativar tema claro" : "Ativar tema escuro"}>
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={dark ? "moon" : "sun"}
          initial={{ rotate: -120, scale: 0.3, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 120, scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {dark ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </m.span>
      </AnimatePresence>
    </IconButton>
  );
}

function ShareButton() {
  const toast = useToast();
  const share = async () => {
    const data = { title: profile.name, text: `Links de ${profile.name}`, url: profile.siteUrl };
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (touch && navigator.canShare?.(data)) {
      try {
        await navigator.share(data);
      } catch {
        /* dismissed */
      }
      return;
    }
    if (await copyText(profile.siteUrl)) toast("Link do portal copiado");
  };
  return (
    <IconButton onClick={share} label="Compartilhar">
      <Share2 className="size-4" />
    </IconButton>
  );
}

export function TopBar({ dark, onThemeChange }: { dark: boolean; onThemeChange: (dark: boolean) => void }) {
  return (
    <m.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-end"
    >
      <div className="flex items-center gap-2">
        <ShareButton />
        <ThemeToggle dark={dark} onChange={onThemeChange} />
      </div>
    </m.nav>
  );
}
