import { ReactNode } from "react";

type DiagramStep = {
  title: string;
  body: string;
  accent?: "slate" | "copper" | "danger";
};

const accentClass = {
  slate: "border-slate-300 bg-white text-slate-950",
  copper: "border-copper-300 bg-[#fff7ef] text-slate-950",
  danger: "border-red-300 bg-[#fff3f1] text-slate-950"
} as const;

export function FlowDiagram({
  title,
  subtitle,
  steps
}: {
  title: string;
  subtitle?: string;
  steps: DiagramStep[];
}) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#fffdf9,#f6ede3)] p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-copper-800">Concept diagram</p>
        <h3 className="mt-2 font-display text-3xl text-slate-950">{title}</h3>
        {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{subtitle}</p> : null}
      </div>
      <div className="grid gap-3 lg:grid-cols-[repeat(3,minmax(0,1fr))]">
        {steps.map((step, index) => (
          <div key={step.title} className="flex items-center gap-3 lg:contents">
            <div className="relative">
              <div className={`rounded-[1.25rem] border p-4 shadow-[0_8px_18px_rgba(15,23,42,0.05)] ${accentClass[step.accent ?? "slate"]}`}>
                <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Step {index + 1}</p>
                <p className="mt-2 text-base font-semibold">{step.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{step.body}</p>
              </div>
              {index < steps.length - 1 ? (
                <div
                  aria-hidden="true"
                  className="absolute left-1/2 top-full flex -translate-x-1/2 items-center gap-2 pt-2 lg:hidden"
                >
                  <span className="h-px w-8 bg-copper-400" />
                  <span className="grid h-6 w-6 place-items-center rounded-full border border-copper-300 bg-[#fff9f4] text-copper-900 shadow-sm">
                    ↓
                  </span>
                  <span className="h-px w-8 bg-copper-400" />
                </div>
              ) : null}
            </div>
            {index < steps.length - 1 ? (
              <div className="hidden items-center justify-center lg:flex">
                <div className="flex min-w-[132px] items-center justify-center gap-2">
                  <span className="h-px w-10 bg-copper-400" />
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-copper-300 bg-[#fff9f4] text-sm text-copper-900 shadow-sm">
                    →
                  </span>
                  <span className="h-px w-10 bg-copper-400" />
                </div>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

export function LadderDiagram({
  title,
  subtitle,
  items
}: {
  title: string;
  subtitle?: string;
  items: Array<{ label: string; note: string; tone?: "safe" | "watch" | "urgent" }>;
}) {
  return (
    <div className="rounded-[1.6rem] border border-slate-200 bg-[linear-gradient(180deg,#fffdf9,#f4ecdf)] p-5">
      <div className="mb-4">
        <p className="text-xs uppercase tracking-[0.2em] text-copper-800">Risk ladder</p>
        <h3 className="mt-2 font-display text-3xl text-slate-950">{title}</h3>
        {subtitle ? <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-700">{subtitle}</p> : null}
      </div>
      <div className="space-y-3">
        {items.map((item, index) => {
          const toneClass =
            item.tone === "urgent"
              ? "border-red-300 bg-[#fff3f1]"
              : item.tone === "watch"
                ? "border-amber-300 bg-[#fff7e8]"
                : "border-emerald-300 bg-[#f2fbf6]";

          return (
            <div key={item.label} className={`grid gap-3 rounded-[1.2rem] border p-4 md:grid-cols-[72px_1fr] ${toneClass}`}>
              <div className="flex items-center gap-2 md:block">
                <span className="inline-flex rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
                  {index + 1}
                </span>
              </div>
              <div>
                <p className="text-base font-semibold text-slate-950">{item.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{item.note}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function DiagramLegend({ children }: { children: ReactNode }) {
  return <div className="text-sm leading-6 text-slate-700">{children}</div>;
}
