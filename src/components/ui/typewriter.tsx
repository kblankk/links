import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/utils";

type Props = {
  words: readonly string[];
  className?: string;
  startDelay?: number;
  typeSpeed?: number;
  deleteSpeed?: number;
  hold?: number;
};

export function Typewriter({
  words,
  className,
  startDelay = 0,
  typeSpeed = 58,
  deleteSpeed = 26,
  hold = 1900,
}: Props) {
  const [text, setText] = useState("");

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        timer = window.setTimeout(resolve, ms);
      });
    const still = prefersReducedMotion();

    (async () => {
      await sleep(startDelay);
      for (let i = 0; !cancelled; i = (i + 1) % words.length) {
        const word = words[i];
        if (still) {
          setText(word);
          await sleep(hold + 1500);
          continue;
        }
        for (let c = 1; c <= word.length && !cancelled; c++) {
          setText(word.slice(0, c));
          await sleep(typeSpeed + Math.random() * 45);
        }
        await sleep(hold);
        for (let c = word.length - 1; c >= 0 && !cancelled; c--) {
          setText(word.slice(0, c));
          await sleep(deleteSpeed);
        }
        await sleep(280);
      }
    })();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [words, startDelay, typeSpeed, deleteSpeed, hold]);

  return (
    <span className={className}>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true">
        {text}
        <span className="ml-px inline-block h-[1.05em] w-[2px] translate-y-[0.18em] animate-caret rounded-full bg-brand" />
      </span>
    </span>
  );
}
