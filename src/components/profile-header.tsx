import { useEffect, useState, type ReactNode } from "react";
import { m } from "motion/react";
import { GraduationCap, MapPin } from "lucide-react";
import { profile } from "@/data/profile";
import { BlurText } from "@/components/ui/blur-text";
import { Typewriter } from "@/components/ui/typewriter";

const ease = [0.22, 1, 0.36, 1] as const;

function Avatar() {
  return (
    <m.div
      initial={{ opacity: 0, scale: 0.7, filter: "blur(12px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.1 }}
      whileHover={{ scale: 1.04 }}
      className="group relative size-28 sm:size-32"
    >
      <div className="absolute -inset-8 rounded-full bg-brand/25 blur-3xl transition-opacity duration-500 group-hover:opacity-100 dark:bg-brand/30" />
      {/* Rotating beam ring */}
      <div className="absolute -inset-[3px] overflow-hidden rounded-full">
        <div className="absolute inset-[-50%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0deg,transparent_200deg,#0096ff_280deg,#00d4ff_330deg,transparent_360deg)]" />
      </div>
      <div className="absolute -inset-[3px] rounded-full ring-1 ring-border-strong" />
      <img
        src={profile.avatar}
        alt={`Foto de ${profile.name}`}
        width={256}
        height={256}
        fetchPriority="high"
        className="relative size-full rounded-full border-[3px] border-background object-cover"
      />
    </m.div>
  );
}

function LocalTime() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 20_000);
    return () => window.clearInterval(id);
  }, []);
  const time = new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: profile.timeZone,
  }).format(now);
  return (
    <time dateTime={now.toISOString()} className="tabular-nums" title="Horário de Brasília">
      {time}
    </time>
  );
}

function Chip({ icon, children }: { icon: ReactNode; children: ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border bg-card px-3 text-xs text-muted backdrop-blur-md">
      {icon}
      {children}
    </span>
  );
}

export function ProfileHeader() {
  return (
    <header className="mt-12 flex flex-col items-center text-center sm:mt-14">
      <Avatar />

      <h1 className="mt-7 max-w-[22ch] text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance sm:text-[2rem]">
        <BlurText
          text={profile.name}
          delay={0.3}
          wordClassName="bg-linear-to-b from-foreground to-foreground/60 bg-clip-text pb-1 text-transparent"
        />
      </h1>

      <m.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.65, duration: 0.6 }}
        className="mt-2 h-6 font-mono text-[13px] leading-6 text-muted sm:text-sm"
      >
        <span className="mr-2 text-brand" aria-hidden="true">
          &gt;
        </span>
        <Typewriter words={profile.roles} startDelay={800} />
      </m.p>

      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease }}
        className="mt-5 flex flex-wrap justify-center gap-2"
      >
        <Chip icon={<MapPin className="size-3.5 text-brand" />}>
          {profile.location}
          <span className="text-subtle">·</span>
          <LocalTime />
        </Chip>
        <Chip icon={<GraduationCap className="size-3.5 text-brand" />}>{profile.education}</Chip>
      </m.div>
    </header>
  );
}
