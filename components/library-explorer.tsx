"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Badge, Card } from "@/components/ui";
import { Fault } from "@/lib/types";

const severityTone: Record<Fault["severity"], "neutral" | "warning" | "danger"> = {
  low: "neutral",
  medium: "neutral",
  high: "warning",
  urgent: "danger"
};

export function LibraryExplorer({ faults }: { faults: Fault[] }) {
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | Fault["severity"]>("all");
  const [tagFilter, setTagFilter] = useState<string>("all");
  const deferredQuery = useDeferredValue(query);

  const tags = useMemo(() => ["all", ...Array.from(new Set(faults.flatMap((fault) => fault.tags))).sort()], [faults]);

  const filteredFaults = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return faults.filter((fault) => {
      const haystack = [fault.title, fault.summary, fault.description, ...fault.tags, ...fault.likelyCauses].join(" ").toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      const matchesSeverity = severityFilter === "all" || fault.severity === severityFilter;
      const matchesTag = tagFilter === "all" || fault.tags.includes(tagFilter);
      return matchesQuery && matchesSeverity && matchesTag;
    });
  }, [deferredQuery, faults, severityFilter, tagFilter]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <Badge tone="neutral">Fault atlas</Badge>
          <h1 className="font-display text-5xl leading-none text-slate-950 sm:text-6xl">Study the patterns behind real domestic faults.</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-700">
            Search by symptom language, risk level, or topic tags to explore how professionals separate likely causes, safe checks, and escalation boundaries.
          </p>
        </Card>
        <Card className="panel-dark space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-copper-200/80">Coverage</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-sand-100/70">Fault patterns</p>
              <p className="mt-2 font-display text-4xl text-white">{faults.length}</p>
            </div>
            <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-sand-100/70">Topics</p>
              <p className="mt-2 font-display text-4xl text-white">{tags.length - 1}</p>
            </div>
          </div>
        </Card>
      </section>

      <Card className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-700">Search titles, summaries, causes, or tags</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try 'borrowed neutral', 'overheating', or 'ring final'..."
              className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-copper-400 focus:ring-4 focus:ring-copper-200/35"
            />
          </label>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">Severity</p>
              <div className="flex flex-wrap gap-2">
                {(["all", "urgent", "high", "medium", "low"] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSeverityFilter(level)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      severityFilter === level
                        ? "bg-slate-950 text-white"
                        : "bg-sand-100 text-slate-700 ring-1 ring-slate-200 hover:bg-white"
                    }`}
                  >
                    {level === "all" ? "All" : level}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-semibold text-slate-700">Topic</p>
              <select
                value={tagFilter}
                onChange={(event) => setTagFilter(event.target.value)}
                className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-copper-400 focus:ring-4 focus:ring-copper-200/35"
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag === "all" ? "All topics" : tag.replaceAll("-", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {filteredFaults.map((fault) => (
            <Link key={fault.slug} href={`/library/${fault.slug}`} className="group">
              <Card className="card-interactive h-full space-y-4 transition duration-300 hover:-translate-y-1 hover:border-copper-400">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={severityTone[fault.severity]}>{fault.severity}</Badge>
                  {fault.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} tone="neutral" className="normal-case tracking-normal">
                      {tag.replaceAll("-", " ")}
                    </Badge>
                  ))}
                </div>
                <div>
                  <h2 className="font-display text-2xl text-slate-950">{fault.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-700">{fault.summary}</p>
                </div>
                <p className="text-sm text-slate-600">
                  Likely causes: <span className="font-semibold text-slate-900">{fault.likelyCauses.slice(0, 2).join(" • ")}</span>
                </p>
              </Card>
            </Link>
          ))}
        </div>

        {filteredFaults.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-sand-100/70 p-8 text-center">
            <p className="font-display text-2xl text-slate-950">No atlas entries matched those filters.</p>
            <p className="mt-2 text-sm text-slate-700">Widen the search or clear one of the filters to reveal more scenarios.</p>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
