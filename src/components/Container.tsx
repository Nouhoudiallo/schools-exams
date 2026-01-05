import { cn } from "@/src/lib/cn";

export function Container({
  className,
  children,
  ...props
}: any) {
  return (
    <div
      {...props}
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8", className)}
    >
      {children}
    </div>
  );
}
