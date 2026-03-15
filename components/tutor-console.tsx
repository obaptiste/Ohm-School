"use client";

import { useMemo, useState } from "react";
import { Badge, Card } from "@/components/ui";

type Session = {
  id: string;
  symptom: string;
  result: string;
  minutes: number;
  risk: "low" | "medium" | "high" | "urgent";
  confidence: "low" | "medium" | "high";
};

const riskTone = {
  low: "neutral",
  medium: "neutral",
  high: "warning",
  urgent: "danger"
} as const;

export function TutorConsole({ sessions }: { sessions: Session[] }) {
  const [riskFilter, setRiskFilter] = useState<"all" | Session["risk"]>("all");

  const filteredSessions = useMemo(
    () => sessions.filter((session) => riskFilter === "all" || session.risk === riskFilter),
    [riskFilter, sessions]
  );

  const average = Math.round(filteredSessions.reduce((acc, session) => acc + session.minutes, 0) / Math.max(filteredSessions.length, 1));
  const urgentCount = filteredSessions.filter((session) => session.risk === "urgent").length;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <Badge tone="neutral">Tutor console</Badge>
          <h1 className="font-display text-5xl leading-none text-slate-950 sm:text-6xl">See where learners hesitate, escalate, and improve.</h1>
          <p className="max-w-2xl text-base leading-7 text-slate-700">
            This workspace is tuned for teaching review: scan scenario outcomes, focus on higher-risk sessions, and identify where instructional reinforcement is needed.
          </p>
        </Card>
        <Card className="panel-dark space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-copper-200/80">Session filter</p>
          <div className="flex flex-wrap gap-2">
            {(["all", "urgent", "high", "medium", "low"] as const).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setRiskFilter(level)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  riskFilter === level
                    ? "bg-white text-slate-950"
                    : "bg-white/8 text-sand-100 ring-1 ring-white/10 hover:bg-white/12"
                }`}
              >
                {level === "all" ? "All sessions" : `${level} risk`}
              </button>
            ))}
          </div>
          <p className="text-sm leading-6 text-sand-100/78">Use the filter to isolate the sessions where safety judgement and escalation language matter most.</p>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <p className="text-xs uppercase tracking-[0.18em] text-copper-700">Visible sessions</p>
          <p className="mt-2 font-display text-4xl text-slate-950">{filteredSessions.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.18em] text-copper-700">Average completion</p>
          <p className="mt-2 font-display text-4xl text-slate-950">{average} min</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.18em] text-copper-700">Urgent outcomes</p>
          <p className="mt-2 font-display text-4xl text-slate-950">{urgentCount}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase tracking-[0.18em] text-copper-700">Teaching focus</p>
          <p className="mt-2 text-lg font-semibold text-slate-950">Escalation confidence</p>
        </Card>
      </section>

      <Card className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-copper-700">Recent work</p>
            <h2 className="mt-2 font-display text-3xl text-slate-950">Cohort activity</h2>
          </div>
          <p className="text-sm text-slate-600">Focus the discussion on why learners chose each path, not just the final answer.</p>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-950 text-sand-50">
              <tr>
                <th className="px-4 py-3 font-semibold">Session</th>
                <th className="px-4 py-3 font-semibold">Symptom</th>
                <th className="px-4 py-3 font-semibold">Top result</th>
                <th className="px-4 py-3 font-semibold">Risk</th>
                <th className="px-4 py-3 font-semibold">Confidence</th>
                <th className="px-4 py-3 font-semibold">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white/80">
              {filteredSessions.map((session) => (
                <tr key={session.id}>
                  <td className="px-4 py-3 font-semibold text-slate-950">{session.id}</td>
                  <td className="px-4 py-3 text-slate-700">{session.symptom}</td>
                  <td className="px-4 py-3 text-slate-700">{session.result}</td>
                  <td className="px-4 py-3">
                    <Badge tone={riskTone[session.risk]}>{session.risk}</Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{session.confidence}</td>
                  <td className="px-4 py-3 text-slate-700">{session.minutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
