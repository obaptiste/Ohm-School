import Link from "next/link";
import { FlowDiagram } from "@/components/concept-diagram";
import { Alert, Badge, Button, Card } from "@/components/ui";
import { faults } from "@/lib/content";
import { Fault } from "@/lib/types";

const severityTone: Record<Fault["severity"], "neutral" | "warning" | "danger"> = {
  low: "neutral",
  medium: "neutral",
  high: "warning",
  urgent: "danger"
};

export default async function FaultDetailPage({ params }: { params: Promise<{ faultSlug: string }> }) {
  const { faultSlug } = await params;
  const fault = faults.find((f) => f.slug === faultSlug);
  if (!fault) return <Alert>Fault not found.</Alert>;

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge tone={severityTone[fault.severity]}>{fault.severity}</Badge>
            {fault.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} tone="neutral" className="normal-case tracking-normal">
                {tag.replaceAll("-", " ")}
              </Badge>
            ))}
          </div>
          <h1 className="font-display text-5xl leading-none text-slate-950 sm:text-6xl">{fault.title}</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-700">{fault.description}</p>
        </Card>
        <Card className="panel-dark space-y-4">
          <p className="text-xs uppercase tracking-[0.22em] text-copper-200">Risk framing</p>
          <p className="text-sm leading-7 text-sand-50/95">{fault.dangerNotes}</p>
          <Alert className="border-copper-300/25 bg-copper-500/14 text-sand-50">
            {fault.escalationGuidance}
          </Alert>
          <Link href="/diagnose">
            <Button variant="secondary">Open diagnosis studio</Button>
          </Link>
        </Card>
      </section>

      <FlowDiagram
        title="How to read this fault entry"
        subtitle="Use the page in this order so learners connect the symptom pattern to action boundaries and not just the label."
        steps={[
          {
            title: "Recognise the pattern",
            body: "Compare the common symptoms to what is actually happening on site.",
            accent: "slate"
          },
          {
            title: "Understand likely causes",
            body: "See which hidden conditions could create that same outward behavior.",
            accent: "copper"
          },
          {
            title: "Stay inside the boundary",
            body: "Use only safe checks, then hand over to qualified testing where the page tells you to stop.",
            accent: "danger"
          }
        ]}
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-3xl text-slate-950">Common symptom pattern</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {fault.commonSymptoms.map((symptom) => (
              <li key={symptom} className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-3">
                {symptom}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-3xl text-slate-950">Likely causes</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {fault.likelyCauses.map((cause) => (
              <li key={cause} className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-3">
                {cause}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-3xl text-slate-950">Safe observational checks</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {fault.safeChecks.map((check) => (
              <li key={check} className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-3">
                {check}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display text-3xl text-slate-950">What a qualified electrician may test next</h2>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-copper-700">For qualified users only</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
            {fault.electricianTestsNext.map((test) => (
              <li key={test} className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-3">
                {test}
              </li>
            ))}
          </ul>
        </Card>
      </section>
    </div>
  );
}
