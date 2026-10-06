import type { ButtonHTMLAttributes } from "react";
import { m } from "motion/react";
import { Share2 } from "lucide-react";
import { profile } from "@/data/profile";
import { useToast } from "@/components/toast";
import { cn, copyText } from "@/lib/utils";

function IconButton({ label, className, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
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

export function TopBar() {
  return (
    <m.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-end"
    >
      <ShareButton />
    </m.nav>
  );
}
