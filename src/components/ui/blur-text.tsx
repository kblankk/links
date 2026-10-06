import { m } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
};

/** Word-by-word blur-in reveal. */
export function BlurText({ text, className, wordClassName, delay = 0, stagger = 0.07 }: Props) {
  const words = text.split(" ");
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <m.span
            className={cn("inline-block will-change-[transform,filter,opacity]", wordClassName)}
            initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: delay + i * stagger, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {word}
          </m.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </span>
  );
}
