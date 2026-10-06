import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, m } from "motion/react";
import { Check } from "lucide-react";

const ToastContext = createContext<(message: string) => void>(() => {});

export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ id: number; message: string } | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((message: string) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message });
    timer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] z-50 flex justify-center px-4"
      >
        <AnimatePresence mode="popLayout">
          {toast && (
            <m.div
              key={toast.id}
              initial={{ opacity: 0, y: 18, scale: 0.94, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 10, scale: 0.97, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="flex items-center gap-2.5 rounded-full border border-border-strong bg-background/85 py-2 pr-4 pl-2 text-sm font-medium text-foreground shadow-[0_12px_40px_-12px_rgb(0_0_0/0.5)] backdrop-blur-xl"
            >
              <span className="grid size-6 place-items-center rounded-full bg-linear-to-br from-brand-2 to-brand text-white">
                <Check className="size-3.5" strokeWidth={3} />
              </span>
              {toast.message}
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
