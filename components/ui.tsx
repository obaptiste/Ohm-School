import { ButtonHTMLAttributes, ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type ButtonVariant = "primary" | "secondary" | "ghost";
type BadgeTone = "neutral" | "success" | "warning" | "danger";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-slate-950 text-white shadow-[0_18px_34px_rgba(15,23,42,0.18)] hover:-translate-y-0.5 hover:bg-[#18233a]",
  secondary:
    "bg-white/18 text-white ring-1 ring-white/28 backdrop-blur hover:-translate-y-0.5 hover:bg-white/24",
  ghost:
    "bg-sand-100 text-slate-950 ring-1 ring-slate-300 hover:-translate-y-0.5 hover:bg-white"
};

const badgeTones: Record<BadgeTone, string> = {
  neutral: "bg-slate-900/[0.05] text-slate-700 ring-1 ring-slate-900/10",
  success: "bg-emerald-100 text-emerald-900 ring-1 ring-emerald-200",
  warning: "bg-amber-100 text-amber-950 ring-1 ring-amber-200",
  danger: "bg-red-100 text-red-900 ring-1 ring-red-200"
};

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cx(
        "rounded-[1.75rem] border border-slate-900/8 bg-[rgba(255,252,248,0.9)] p-5 shadow-[0_20px_45px_rgba(27,31,35,0.06)] backdrop-blur-sm sm:p-6",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Button({
  children,
  className = "",
  type = "button",
  variant = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-copper-700 disabled:cursor-not-allowed disabled:opacity-60",
        buttonVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({
  children,
  className = "",
  tone = "neutral"
}: {
  children: ReactNode;
  className?: string;
  tone?: BadgeTone;
}) {
  return (
    <span className={cx("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.16em]", badgeTones[tone], className)}>
      {children}
    </span>
  );
}

export function Alert({
  children,
  className = ""
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cx(
        "rounded-[1.4rem] border border-red-200 bg-[linear-gradient(135deg,rgba(255,240,238,0.98),rgba(255,248,245,0.98))] p-4 text-sm leading-6 text-red-950 shadow-[0_10px_28px_rgba(127,29,29,0.08)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  const clamped = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className="h-3 w-full overflow-hidden rounded-full bg-slate-900/8"
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress indicator"
    >
      <div
        className="h-full rounded-full bg-[linear-gradient(90deg,#14223b,#a35222)] transition-all duration-300"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
