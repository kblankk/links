import type { ReactNode } from "react";
import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m, type Variants } from "motion/react";
import { links, profile, stack } from "@/data/profile";
import { ShaderBackground } from "@/components/ui/shader-background";
import { TopBar } from "@/components/top-bar";
import { ProfileHeader } from "@/components/profile-header";
import { LinkCard } from "@/components/link-card";
import { ToastProvider } from "@/components/toast";
import { Marquee } from "@/components/ui/marquee";
import { BrandIcon } from "@/components/ui/brand-icon";
import { NumberTicker } from "@/components/ui/number-ticker";
import { useGitHubStats } from "@/hooks/use-github-stats";

const ease = [0.22, 1, 0.36, 1] as const;

const list: Variants = {
  hidden: {},
  show: { transition: { delayChildren: 0.95, staggerChildren: 0.075 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(8px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease } },
};

function Reveal({ delay, children, className }: { delay: number; children: ReactNode; className?: string }) {
  return (
    <m.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease }}
      className={className}
    >
      {children}
    </m.div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.2em] text-subtle uppercase">
      <span className="text-brand">//</span>
      <span>{children}</span>
      <span className="h-px flex-1 bg-linear-to-r from-border-strong to-transparent" />
    </div>
  );
}

export default function App() {
  const stats = useGitHubStats(profile.username);

  const githubExtra = (
    <AnimatePresence>
      {stats && (
        <m.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <span className="mx-1.5 text-subtle">·</span>
          <NumberTicker value={stats.repos} /> repositórios
        </m.span>
      )}
    </AnimatePresence>
  );

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <ToastProvider>
          <ShaderBackground />

          <main className="relative mx-auto flex min-h-dvh w-full max-w-[30rem] flex-col px-5 pt-5 pb-8 sm:pt-8">
            <TopBar />
            <ProfileHeader />

            <section aria-labelledby="links-title" className="mt-11">
              <Reveal delay={0.9}>
                <SectionLabel>
                  <span id="links-title">conecte-se</span>
                </SectionLabel>
              </Reveal>
              <m.ul variants={list} initial="hidden" animate="show" className="mt-4 flex flex-col gap-3">
                {links.map((link) => (
                  <m.li key={link.id} variants={item}>
                    <LinkCard link={link} extra={link.id === "github" ? githubExtra : undefined} />
                  </m.li>
                ))}
              </m.ul>
            </section>

            <Reveal delay={1.5} className="mt-11">
              <section aria-labelledby="stack-title">
                <SectionLabel>
                  <span id="stack-title">stack</span>
                </SectionLabel>
                <Marquee className="mask-fade-x mt-4 -mx-5">
                  {stack.map((tech) => (
                    <span
                      key={tech.label}
                      className="inline-flex h-8 items-center gap-2 rounded-full border border-border bg-card px-3.5 text-[12.5px] whitespace-nowrap text-muted backdrop-blur-md transition-colors duration-200 hover:border-border-strong hover:text-foreground"
                    >
                      <BrandIcon name={tech.icon} className="size-3.5" />
                      {tech.label}
                    </span>
                  ))}
                </Marquee>
              </section>
            </Reveal>

            <Reveal delay={1.7} className="mt-auto pt-14">
              <footer className="flex flex-col items-center gap-1.5 text-center font-mono text-[11px] text-subtle">
                <p>
                  © {new Date().getFullYear()} {profile.name}
                </p>
                <p className="flex items-center gap-1.5">
                  <span className="relative flex size-1.5">
                    <span className="absolute inline-flex size-full animate-ping-slow rounded-full bg-brand opacity-70" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
                  </span>
                  kblankk.github.io/links
                </p>
              </footer>
            </Reveal>
          </main>
        </ToastProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
