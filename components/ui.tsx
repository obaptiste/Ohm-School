import { ButtonHTMLAttributes, ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-workshop-300 bg-white p-4 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  className = "",
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`rounded-lg bg-workshop-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-workshop-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-workshop-900 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${className}`}>
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
      className={`rounded-lg border-l-4 border-red-600 bg-red-50 p-3 text-sm ${className}`}
    >
      {children}
    </div>
  );
}

export function Progress({ value }: { value: number }) {
  return (
    <div
      className="h-2 w-full rounded-full bg-workshop-300"
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Progress indicator"
    >
      <div
        className="h-2 rounded-full bg-workshop-900 transition-all duration-300"
        style={{ width: `${Math.min(Math.max(value, 0), 100)}%` }}
      />
    </div>
  );
}
