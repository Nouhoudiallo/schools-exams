import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: any) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset]",
        className,
      )}
    >
      {children}
    </div>
  );
}
