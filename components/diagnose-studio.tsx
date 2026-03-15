"use client";

import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { Fault } from "@/lib/types";

type Symptom = {
  title: string;
  slug: string;
};

const severityOrder: Fault["severity"][] = ["urgent", "high", "medium", "low"];

function pickSeverity(symptom: Symptom, faults: Fault[]): Fault["severity"] {
  const related = faults.find((fault) => fault.slug === symptom.slug);
  return related?.severity ?? "medium";
}

function pickTags(symptom: Symptom, faults: Fault[]) {
  const related = faults.find((fault) => fault.slug === symptom.slug);
  return related?.tags.slice(0, 2) ?? ["guided triage"];
}

export function DiagnoseStudio({ symptoms, faults }: { symptoms: readonly Symptom[]; faults: Fault[] }) {
  const [query, setQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState<"all" | Fault["severity"]>("all");
  const deferredQuery = useDeferredValue(query);

  const enrichedSymptoms = useMemo(
    () =>
      symptoms.map((symptom) => ({
        ...symptom,
        severity: pickSeverity(symptom, faults),
        tags: pickTags(symptom, faults)
      })),
    [faults, symptoms]
  );

  const filteredSymptoms = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    return enrichedSymptoms
      .filter((symptom) => {
        const matchesQuery =
          !normalizedQuery ||
          symptom.title.toLowerCase().includes(normalizedQuery) ||
          symptom.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery));
        const matchesSeverity = severityFilter === "all" || symptom.severity === severityFilter;
        return matchesQuery && matchesSeverity;
      })
      .sort(
        (left, right) =>
          severityOrder.indexOf(left.severity) - severityOrder.indexOf(right.severity) ||
          left.title.localeCompare(right.title)
      );
  }, [deferredQuery, enrichedSymptoms, severityFilter]);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="hero-panel border-0 px-6 py-8 text-white shadow-[0_24px_70px_rgba(18,26,43,0.14)]">
          <Badge className="bg-white/12 text-white ring-1 ring-white/20">Diagnosis studio</Badge>
          <h1 className="mt-4 font-display text-5xl leading-none sm:text-6xl">Start from the symptom. Stay inside safe boundaries.</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-sand-100/88">
            Search a symptom, choose the closest match, and let Ohm School guide the reasoning path toward likely faults, escalation markers, and safe observational next steps.
          </p>
        </Card>

        <Card className="space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-copper-700">How it works</p>
          <div className="space-y-3">
            {[
              "Choose the closest symptom pattern from the shortlist.",
              "Answer one question at a time using what you can safely observe.",
              "Review the weighted fault shortlist, confidence level, and escalation guidance."
            ].map((step, index) => (
              <div key={step} className="flex gap-3 rounded-[1.4rem] border border-slate-200 bg-sand-100/70 p-4">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-slate-950 text-sm font-semibold text-white">{index + 1}</div>
                <p className="text-sm leading-6 text-slate-700">{step}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <Card className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-copper-700">Entry point</p>
            <h2 className="mt-2 font-display text-3xl text-slate-950">Find the right diagnostic path</h2>
          </div>
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
                {level === "all" ? "All severities" : level}
              </button>
            ))}
          </div>
        </div>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Search symptoms or topics</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try 'rcd', 'lighting', 'burn marks'..."
            className="w-full rounded-[1rem] border border-slate-200 bg-white px-4 py-3 text-base text-slate-950 outline-none transition focus:border-copper-400 focus:ring-4 focus:ring-copper-200/35"
          />
        </label>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {filteredSymptoms.map((symptom) => (
            <Link key={symptom.slug} href={`/diagnose/${symptom.slug}`} className="group">
              <Card className="card-interactive h-full space-y-4 transition duration-300 hover:-translate-y-1 hover:border-copper-400">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone={symptom.severity === "urgent" ? "danger" : symptom.severity === "high" ? "warning" : "neutral"}>
                    {symptom.severity}
                  </Badge>
                  {symptom.tags.map((tag) => (
                    <Badge key={tag} tone="neutral" className="normal-case tracking-normal">
                      {tag.replaceAll("-", " ")}
                    </Badge>
                  ))}
                </div>
                <div>
                  <h3 className="font-display text-2xl text-slate-950">{symptom.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-700">Open a guided path with safe boundaries, weighted logic, and a professional-style outcome summary.</p>
                </div>
                <p className="text-sm font-semibold text-copper-800 transition group-hover:translate-x-1">Open path →</p>
              </Card>
            </Link>
          ))}
        </div>

        {filteredSymptoms.length === 0 ? (
          <div className="rounded-[1.4rem] border border-dashed border-slate-300 bg-sand-100/70 p-8 text-center">
            <p className="font-display text-2xl text-slate-950">No symptom matched that search.</p>
            <p className="mt-2 text-sm text-slate-700">Try a broader phrase like “trip”, “lighting”, or “socket”.</p>
          </div>
        ) : null}

        <div className="flex justify-end">
          <Link href="/library">
            <Button variant="ghost">Need theory first? Open the atlas</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
