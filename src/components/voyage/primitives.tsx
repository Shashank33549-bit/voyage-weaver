import { cva, type VariantProps } from "class-variance-authority";
import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { CountUp } from "@/components/animations/text";
import { Magnetic } from "@/components/animations/interactive";

export const voyageButton = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-tight transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:brightness-110 shadow-[0_18px_50px_-18px_color-mix(in_oklab,var(--primary)_75%,transparent)] hover:shadow-[0_26px_70px_-18px_color-mix(in_oklab,var(--primary)_85%,transparent)]",
        sunset:
          "text-sunset-foreground bg-[image:var(--gradient-sunset)] hover:brightness-110 shadow-[0_18px_50px_-18px_color-mix(in_oklab,var(--sunset)_65%,transparent)]",
        glass:
          "glass text-foreground hover:border-primary/50 hover:bg-surface-2/70",
        ghost: "text-muted-foreground hover:text-foreground hover:bg-surface/70",
        outline:
          "border border-border text-foreground hover:border-cyan/60 hover:text-cyan",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof voyageButton> & { magnetic?: boolean };

export function VButton({
  className,
  variant,
  size,
  magnetic,
  ...props
}: ButtonProps) {
  const button = (
    <button className={cn(voyageButton({ variant, size }), className)} {...props} />
  );
  return magnetic ? <Magnetic>{button}</Magnetic> : button;
}

export function GlassPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("glass rounded-3xl", className)}>{children}</div>
  );
}

export function Chip({
  children,
  active,
  onClick,
  className,
}: {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}) {
  const Tag = onClick ? "button" : "span";
  return (
    <Tag
      onClick={onClick}
      aria-pressed={onClick ? !!active : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-300",
        active
          ? "border-cyan/60 bg-cyan/12 text-cyan"
          : "border-border bg-surface/60 text-muted-foreground hover:border-cyan/40 hover:text-foreground",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="text-3xl leading-[1.08] font-semibold sm:text-4xl lg:text-[2.9rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}

export function ProgressBar({
  value,
  tone = "primary",
  className,
  label,
}: {
  value: number;
  tone?: "primary" | "cyan" | "sunset" | "success" | "warning" | "destructive";
  className?: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const toneVar: Record<string, string> = {
    primary: "var(--primary)",
    cyan: "var(--cyan)",
    sunset: "var(--sunset)",
    success: "var(--success)",
    warning: "var(--warning)",
    destructive: "var(--destructive)",
  };

  return (
    <div
      ref={ref}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "h-2 w-full overflow-hidden rounded-full bg-surface-2",
        className,
      )}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: `linear-gradient(90deg, color-mix(in oklab, ${toneVar[tone]} 70%, transparent), ${toneVar[tone]})`,
        }}
        initial={{ width: 0 }}
        animate={{ width: inView ? `${Math.min(Math.max(value, 0), 100)}%` : 0 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}

export function HealthRing({
  value,
  size = 168,
  label = "Trip health",
  caption,
}: {
  value: number;
  size?: number;
  label?: string;
  caption?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const stroke = size > 140 ? 10 : 8;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const tone =
    value >= 85 ? "var(--success)" : value >= 65 ? "var(--cyan)" : "var(--warning)";

  return (
    <div ref={ref} className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: inView
              ? circumference - (circumference * value) / 100
              : circumference,
          }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          style={{ filter: `drop-shadow(0 0 12px ${tone})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span
          className="font-display font-semibold"
          style={{ fontSize: size / 4.2 }}
        >
          <CountUp to={value} format={false} />
        </span>
        <span className="text-[0.62rem] tracking-[0.18em] text-muted-foreground uppercase">
          {caption ?? `/ 100 ${label}`}
        </span>
      </div>
    </div>
  );
}

export function StateIcon({ state }: { state: "pass" | "warn" | "fail" }) {
  const map = {
    pass: { char: "✓", cls: "bg-success/15 text-success border-success/30" },
    warn: { char: "!", cls: "bg-warning/15 text-warning border-warning/30" },
    fail: { char: "✕", cls: "bg-destructive/15 text-destructive border-destructive/30" },
  }[state];
  return (
    <span
      aria-hidden
      className={cn(
        "grid size-6 shrink-0 place-items-center rounded-full border text-xs font-bold",
        map.cls,
      )}
    >
      {map.char}
    </span>
  );
}

export function Divider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "h-px w-full bg-gradient-to-r from-transparent via-border to-transparent",
        className,
      )}
    />
  );
}
