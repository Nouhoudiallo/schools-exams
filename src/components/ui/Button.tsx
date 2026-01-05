import { cn } from "@/src/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

export function Button({ variant = "primary", className, children, ...props }: any) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition will-change-transform active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30";

  const variants: Record<Variant, string> = {
    primary:
      "bg-gradient-to-b from-white/20 to-white/10 ring-1 ring-white/15 hover:from-white/25 hover:to-white/15",
    secondary: "bg-white/10 ring-1 ring-white/10 hover:bg-white/15",
    ghost: "hover:bg-white/10",
  };

  const key: Variant = variant in variants ? (variant as Variant) : "primary";

  const classes = cn(base, variants[key], className);

  if (typeof props?.href === "string") {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button {...props} className={classes}>
      {children}
    </button>
  );
}
