import Link from "next/link";
import { FlowDiagram } from "@/components/concept-diagram";
import { Alert, Badge, Button, Card } from "@/components/ui";
import { faults, symptoms } from "@/lib/content";

const capabilityGroups = [
  {
    title: "Structured triage",
    body: "Move from vague symptoms to a grounded fault shortlist without improvising unsafe next steps."
  },
  {
    title: "Learning reinforcement",
    body: "See the reasoning behind each branch so learners build diagnostic habits, not just answers."
  },
  {
    title: "Tutor oversight",
    body: "Track scenario patterns, safety escalation points, and where trainees need more support."
  }
];

const journeyOptions = [
  {
    href: "/diagnose",
    label: "Start a diagnosis",
    eyebrow: "Live triage",
    body: "Guided symptom-led questioning with risk-aware branching and a final action summary."
  },
  {
    href: "/library",
    label: "Browse the fault atlas",
    eyebrow: "Study mode",
    body: "Search and filter the knowledge base by severity, topic, and likely root cause."
  },
  {
    href: "/tutor",
    label: "Open tutor console",
    eyebrow: "Teaching tools",
    body: "Review learner sessions, spot recurring misconceptions, and focus teaching effort."
  }
];

const urgentFaults = faults.filter((fault) => fault.severity === "urgent").slice(0, 3);
const tagHighlights = Array.from(new Set(faults.flatMap((fault) => fault.tags))).slice(0, 8);

export default function HomePage() {
  return (
    <div className="space-y-10 pb-10">
      <section className="hero-panel overflow-hidden px-6 py-8 sm:px-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_0.9fr]">
          <div className="space-y-6">
            <Badge className="bg-white/12 text-white ring-1 ring-white/20">
              Ohm School • Domestic fault-finding practice
            </Badge>
            <div className="max-w-3xl space-y-4">
              <h1 className="font-display text-5xl leading-none text-white sm:text-6xl">
                Learn electrical fault logic like a calm, methodical pro.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-sand-100/88 sm:text-lg">
                Ohm School gives learners, tutors, and training centres a safer way to practise diagnostic reasoning for UK domestic installations without drifting into risky DIY instruction.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/diagnose">
                <Button>Launch diagnosis studio</Button>
              </Link>
              <Link href="/library">
                <Button variant="secondary">Explore the fault atlas</Button>
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Card className="border-white/10 bg-white/10 text-white shadow-none backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-sand-50/90">Symptom entries</p>
                <p className="mt-3 font-display text-4xl">{symptoms.length}</p>
              </Card>
              <Card className="border-white/10 bg-white/10 text-white shadow-none backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-sand-50/90">Fault patterns</p>
                <p className="mt-3 font-display text-4xl">{faults.length}</p>
              </Card>
              <Card className="border-white/10 bg-white/10 text-white shadow-none backdrop-blur">
                <p className="text-xs uppercase tracking-[0.24em] text-sand-50/90">Urgent scenarios</p>
                <p className="mt-3 font-display text-4xl">{urgentFaults.length}</p>
              </Card>
            </div>
          </div>

          <Card className="panel-dark space-y-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-copper-200">Mission control</p>
              <h2 className="mt-2 font-display text-3xl text-white">What today’s cohort needs most</h2>
            </div>
            <div className="space-y-3">
              {capabilityGroups.map((group) => (
                <div key={group.title} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{group.title}</p>
                  <p className="mt-1 text-sm leading-6 text-sand-50/95">{group.body}</p>
                </div>
              ))}
            </div>
            <Alert className="border-copper-300/40 bg-copper-500/12 text-sand-50">
              Educational and triage-oriented only. No live work, no cover removal, no bypassing protective devices, and no invasive testing unless competent and qualified.
            </Alert>
          </Card>
        </div>
      </section>

      <FlowDiagram
        title="How Ohm School teaches fault logic"
        subtitle="The learning journey mirrors a good professional habit: observe first, reason carefully, and escalate when risk markers appear."
        steps={[
          {
            title: "Start with the symptom",
            body: "Choose the visible pattern rather than guessing the root cause too early.",
            accent: "slate"
          },
          {
            title: "Follow the guided questions",
            body: "Each answer narrows likely faults and lifts risk signals when danger markers appear.",
            accent: "copper"
          },
          {
            title: "Review conclusion and boundary",
            body: "The outcome explains likely causes, confidence, and whether to stop and escalate.",
            accent: "danger"
          }
        ]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {journeyOptions.map((option) => (
          <Link key={option.href} href={option.href} className="group">
            <Card className="card-interactive h-full space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-copper-700">{option.eyebrow}</p>
              <div>
                <h2 className="font-display text-3xl text-slate-950">{option.label}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-700">{option.body}</p>
              </div>
              <p className="text-sm font-semibold text-copper-800 transition group-hover:translate-x-1">
                Open workspace →
              </p>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-copper-700">High-risk training set</p>
              <h2 className="mt-2 font-display text-3xl text-slate-950">Urgent patterns every learner should recognise fast</h2>
            </div>
            <Link href="/library">
              <Button variant="ghost">View full atlas</Button>
            </Link>
          </div>
          <div className="grid gap-3">
            {urgentFaults.map((fault) => (
              <Link key={fault.slug} href={`/library/${fault.slug}`} className="group">
                <div className="rounded-[1.5rem] border border-slate-200 bg-sand-100/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-copper-400 hover:shadow-[0_14px_30px_rgba(34,32,32,0.08)]">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge tone="danger">{fault.severity}</Badge>
                    <p className="text-sm font-semibold text-slate-950">{fault.title}</p>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-700">{fault.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </Card>

        <Card className="space-y-5">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-copper-700">Topic map</p>
            <h2 className="mt-2 font-display text-3xl text-slate-950">Explore the knowledge graph by theme</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {tagHighlights.map((tag) => (
              <Badge key={tag} tone="neutral" className="px-3 py-2 text-sm">
                {tag.replaceAll("-", " ")}
              </Badge>
            ))}
          </div>
          <p className="text-sm leading-6 text-slate-700">
            The atlas is organised around realistic symptoms, protection-device behaviour, and escalation rules so learners stay anchored in safe observational practice.
          </p>
        </Card>
      </section>
    </div>
  );
}
