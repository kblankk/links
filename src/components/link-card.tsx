import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { ArrowUpRight, Check, Copy, Globe, Mail } from "lucide-react";
import type { LinkItem } from "@/data/profile";
import { BrandIcon } from "@/components/ui/brand-icon";
import { useToast } from "@/components/toast";
import { useSpotlight } from "@/hooks/use-spotlight";
import { cn, copyText } from "@/lib/utils";

const surface =
  "relative isolate flex h-[4.25rem] w-full cursor-pointer items-center gap-4 overflow-hidden rounded-2xl border border-border bg-card pl-3 text-left backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-300 group-hover:border-border-strong group-hover:bg-card-hover group-hover:shadow-[0_10px_40px_-18px_var(--brand)] focus-visible:outline-offset-2";

function Glyph({ link, className }: { link: LinkItem; className?: string }) {
  if (link.icon.kind === "brand") return <BrandIcon name={link.icon.name} className={className} />;
  const Icon = link.icon.name === "globe" ? Globe : Mail;
  return <Icon className={className} strokeWidth={2} />;
}

/** Hover layers + icon tile + labels shared by every card variant. */
function CardBody({ link, extra }: { link: LinkItem; extra?: ReactNode }) {
  return (
    <>
      <span className="spotlight-fill -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <span className="border-glow opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-foreground/[0.04] text-foreground transition-[color,border-color,transform] duration-300 group-hover:scale-105 group-hover:border-transparent group-hover:text-white">
        <span
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: link.tile }}
        />
        <Glyph link={link} className="relative size-5" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-[15px] leading-tight font-medium tracking-[-0.01em] text-foreground">{link.title}</span>
        <span className="mt-1 truncate font-mono text-[12.5px] leading-tight text-muted">
          {link.subtitle}
          {extra}
        </span>
      </span>
    </>
  );
}

function ArrowSwap() {
  return (
    <span className="relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-full text-subtle transition-colors duration-300 group-hover:bg-foreground/[0.06] group-hover:text-foreground">
      <ArrowUpRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-5 group-hover:-translate-y-5" />
      <ArrowUpRight className="absolute size-4 -translate-x-5 translate-y-5 transition-transform duration-300 ease-out group-hover:translate-x-0 group-hover:translate-y-0" />
    </span>
  );
}

function useCopied() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const flash = () => {
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };
  return { copied, flash };
}

function CopyGlyph({ copied }: { copied: boolean }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.span
        key={copied ? "check" : "copy"}
        initial={{ scale: 0.4, opacity: 0, rotate: -45 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        exit={{ scale: 0.4, opacity: 0, rotate: 45 }}
        transition={{ duration: 0.18 }}
        className={cn("grid place-items-center", copied && "text-emerald-500")}
      >
        {copied ? <Check className="size-4" strokeWidth={2.5} /> : <Copy className="size-4" />}
      </m.span>
    </AnimatePresence>
  );
}

const press = { whileTap: { scale: 0.985 } };

export function LinkCard({ link, extra }: { link: LinkItem; extra?: ReactNode }) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const toast = useToast();
  const { copied, flash } = useCopied();
  const style = { "--brand": link.brand } as CSSProperties;

  const copy = async (value: string, label: string) => {
    if (await copyText(value)) {
      flash();
      toast(label);
    }
  };

  return (
    <m.div
      ref={ref}
      onPointerMove={onPointerMove}
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group relative"
      style={style}
    >
      {link.type === "link" && (
        <m.a {...press} href={link.href} target="_blank" rel="noopener noreferrer" className={cn(surface, "pr-4")}>
          <CardBody link={link} extra={extra} />
          <ArrowSwap />
        </m.a>
      )}

      {link.type === "mail" && (
        <>
          <m.a {...press} href={link.href} className={cn(surface, "pr-16")}>
            <CardBody link={link} extra={extra} />
          </m.a>
          <button
            type="button"
            onClick={() => copy(link.copy, link.copiedLabel)}
            aria-label={`Copiar ${link.title.toLowerCase()}`}
            title="Copiar"
            className="absolute top-1/2 right-4 z-10 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-subtle transition-[color,background-color,transform] duration-200 hover:bg-foreground/[0.08] hover:text-foreground active:scale-90"
          >
            <CopyGlyph copied={copied} />
          </button>
        </>
      )}

      {link.type === "copy" && (
        <m.button
          {...press}
          type="button"
          onClick={() => copy(link.copy, link.copiedLabel)}
          aria-label={`Copiar usuário do ${link.title}: ${link.copy}`}
          className={cn(surface, "pr-4")}
        >
          <CardBody link={link} extra={extra} />
          <span className="grid size-8 shrink-0 place-items-center rounded-full text-subtle transition-colors duration-300 group-hover:bg-foreground/[0.06] group-hover:text-foreground">
            <CopyGlyph copied={copied} />
          </span>
        </m.button>
      )}
    </m.div>
  );
}
