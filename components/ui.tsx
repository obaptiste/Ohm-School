import { ButtonHTMLAttributes, ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-xl border border-workshop-300 bg-white p-4 shadow-sm ${className}`}>{children}</div>;
}

export function Button({ children, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`rounded-lg bg-workshop-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-workshop-700 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Badge({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${className}`}>{children}</span>;
}

export function Alert({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-lg border-l-4 border-red-600 bg-red-50 p-3 text-sm ${className}`}>{children}</div>;
}

export function Progress({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-workshop-300">
      <div className="h-2 rounded-full bg-workshop-900" style={{ width: `${value}%` }} />
    </div>
  );
}
