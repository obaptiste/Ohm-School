"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { FlowDiagram, LadderDiagram } from "@/components/concept-diagram";
import { Alert, Badge, Button, Card, Progress } from "@/components/ui";
import { ErrorBoundary } from "@/components/error-boundary";
import { decisionTrees, faults, learningArticles, symptoms } from "@/lib/content";
import { chooseNextQuestion, runInference } from "@/lib/engine";
import { answerSchema } from "@/lib/validation";
import { Fault } from "@/lib/types";

const severityTone: Record<Fault["severity"], "neutral" | "warning" | "danger"> = {
  low: "neutral",
  medium: "neutral",
  high: "warning",
  urgent: "danger"
};

export default function SymptomFlowPage() {
  const params = useParams<{ symptomSlug: string }>();
  const symptomSlug = params?.symptomSlug;
  const symptom = symptoms.find((entry) => entry.slug === symptomSlug);
  const tree = decisionTrees.find((entry) => entry.symptomSlug === symptomSlug);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentKey, setCurrentKey] = useState(tree?.startNodeKey);

  const node = tree?.nodes.find((entry) => entry.key === currentKey);
  const progress = tree ? Math.round((Object.keys(answers).length / tree.nodes.length) * 100) : 0;
  const result = useMemo(() => (tree ? runInference(tree, answers) : null), [answers, tree]);
  const complete = tree ? !node || Object.keys(answers).length >= tree.nodes.length : false;

  if (!symptom) return <Alert>Unknown symptom.</Alert>;
  if (!tree) return <Alert>This symptom has not been wired into a full decision tree yet. Use the fault atlas while that path is being expanded.</Alert>;

  const submitAnswer = (value: string, nextNodeKey?: string) => {
    if (!node) return;

    const parsed = answerSchema.safeParse({ nodeKey: node.key, value });
    if (!parsed.success) return;

    const nextAnswers = { ...answers, [node.key]: parsed.data.value };
    setAnswers(nextAnswers);
    setCurrentKey(nextNodeKey ?? chooseNextQuestion(tree, node.key, nextAnswers, parsed.data.value));
  };

  const restart = () => {
    setAnswers({});
    setCurrentKey(tree.startNodeKey);
  };

  const likelyFaultCards = (result?.likelyCauses ?? [])
    .map((slug) => faults.find((fault) => fault.slug === slug))
    .filter((fault): fault is Fault => Boolean(fault));

  const relatedArticles = learningArticles.filter((article) =>
    article.relatedFaultSlugs.some((slug) => likelyFaultCards.some((fault) => fault.slug === slug))
  );

  return (
    <ErrorBoundary>
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <Card className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge tone={node?.safetyGate ? "danger" : "neutral"}>{node?.safetyGate ? "safety gate" : "guided workflow"}</Badge>
              <p className="text-sm text-slate-600">{symptom.title}</p>
            </div>
            <h1 className="font-display text-5xl leading-none text-slate-950 sm:text-6xl">Diagnosis path</h1>
            <p className="text-base leading-7 text-slate-700">
              Answer using safe observations only. Each choice updates the fault weighting, confidence, and escalation framing in real time.
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </Card>

          <Card className="panel-dark space-y-4">
            <p className="text-xs uppercase tracking-[0.22em] text-copper-200">Live reading</p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-sand-50/90">Answers logged</p>
                <p className="mt-2 font-display text-4xl text-white">{Object.keys(answers).length}</p>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-sand-50/90">Risk level</p>
                <p className="mt-2 font-display text-2xl text-white">{result?.riskLevel ?? "low"}</p>
              </div>
              <div className="rounded-[1.3rem] border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-sand-50/90">Confidence</p>
                <p className="mt-2 font-display text-2xl text-white">{result?.confidenceLevel ?? "low"}</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-sand-50/92">
              The engine combines weighted cause signals with independent risk markers so urgent symptoms can escalate even before the full tree is finished.
            </p>
          </Card>
        </section>

        <FlowDiagram
          title="How the diagnosis engine works"
          subtitle="This is the logic behind the current path, so learners can understand the process instead of treating it like a black box."
          steps={[
            {
              title: "Observation enters the path",
              body: "Each answer records a safe, visible clue about the fault pattern.",
              accent: "slate"
            },
            {
              title: "Weights and risk are updated",
              body: "The engine increases likely causes and separately checks for urgent triggers like heat, smell, or exposed damage.",
              accent: "copper"
            },
            {
              title: "A bounded recommendation appears",
              body: "The result combines likely faults, confidence, and whether continued investigation should stop.",
              accent: "danger"
            }
          ]}
        />

        {complete && result ? (
          <section className="space-y-4">
            <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
              <Card className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge tone={severityTone[result.riskLevel]}>{result.riskLevel}</Badge>
                  <Badge tone="neutral">{result.confidenceLevel} confidence</Badge>
                </div>
                <h2 className="font-display text-4xl text-slate-950">Working conclusion</h2>
                <p className="text-base leading-7 text-slate-700">
                  Top likely fault: <span className="font-semibold text-slate-950">{result.topLikelyFault ?? "insufficient evidence"}</span>
                </p>
                <p className="text-sm leading-6 text-slate-700">
                  Alternative possibilities: {result.alternatives.length ? result.alternatives.join(", ") : "no strong alternatives surfaced"}
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button onClick={restart}>Run this path again</Button>
                  <Link href="/diagnose" className="inline-flex items-center rounded-full bg-sand-100 px-5 py-3 text-sm font-semibold text-slate-900 ring-1 ring-slate-200 transition hover:bg-white">
                    Choose another symptom
                  </Link>
                </div>
              </Card>

              <Alert>
                {result.escalation
                  ? "Escalate to a qualified electrician now. The answers collected point to a scenario where continued energisation or DIY investigation could be unsafe."
                  : "No urgent trigger was hit in this path, but remain within observational checks only and escalate immediately if the symptom worsens."}
              </Alert>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <Card>
                <h3 className="font-display text-3xl text-slate-950">Top likely causes</h3>
                <div className="mt-4 space-y-3">
                  {likelyFaultCards.length ? (
                    likelyFaultCards.map((fault) => (
                      <Link key={fault.slug} href={`/library/${fault.slug}`} className="block rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-4 transition hover:border-copper-400 hover:bg-white">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge tone={severityTone[fault.severity]}>{fault.severity}</Badge>
                          <p className="font-semibold text-slate-950">{fault.title}</p>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{fault.summary}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-sm text-slate-700">Not enough weighted evidence was collected to confidently surface a likely fault.</p>
                  )}
                </div>
              </Card>

              <Card>
                <h3 className="font-display text-3xl text-slate-950">Why the engine leaned this way</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  {result.whyChosen.map((reason) => (
                    <li key={reason} className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-3">
                      {reason}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <LadderDiagram
                title="Escalation ladder"
                subtitle="A learner should move up this ladder as soon as the symptom pattern becomes less certain or more dangerous."
                items={[
                  {
                    label: "Observe only",
                    note: "Record scope, timing, and visible symptoms without opening anything.",
                    tone: "safe"
                  },
                  {
                    label: "Pause and review",
                    note: "If trips repeat, confidence drops, or the pattern broadens, stop experimenting and reassess.",
                    tone: "watch"
                  },
                  {
                    label: "Escalate immediately",
                    note: "Heat, damage, smoke, burning smell, or exposed conductors move the situation straight into qualified intervention.",
                    tone: "urgent"
                  }
                ]}
              />
              <Card>
                <h3 className="font-display text-3xl text-slate-950">Safe next checks</h3>
                <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-700">
                  <li className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-3">Confirm which protective device or area is affected before changing anything else.</li>
                  <li className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-3">Unplug portable appliances if that can be done safely and note whether the symptom changes.</li>
                  <li className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-3">Look only for visible damage, heat, smell, or dampness. Do not remove covers.</li>
                </ul>
              </Card>

              <Card>
                <h3 className="font-display text-3xl text-slate-950">Related reading</h3>
                <div className="mt-4 space-y-3">
                  {relatedArticles.length ? (
                    relatedArticles.map((article) => (
                      <div key={article.slug} className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-4">
                        <p className="font-semibold text-slate-950">{article.title}</p>
                        <p className="mt-2 text-sm leading-6 text-slate-700">{article.body}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-700">No matching article was found for this result set yet.</p>
                  )}
                </div>
              </Card>
            </div>
          </section>
        ) : (
          <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
            <Card className="space-y-5">
              {node ? (
                <>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-copper-700">Current prompt</p>
                    <h2 className="mt-2 font-display text-4xl text-slate-950">{node.question}</h2>
                  </div>
                  <div className="rounded-[1.3rem] border border-slate-200 bg-sand-100/70 p-4">
                    <p className="text-sm leading-6 text-slate-700">{node.explanation}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {node.options.map((option) => (
                      <Button
                        key={option.value}
                        variant="ghost"
                        className="justify-between rounded-[1.4rem] px-4 py-4 text-left text-sm font-semibold"
                        onClick={() => submitAnswer(option.value, option.nextNodeKey)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                  {node.safetyGate ? (
                    <Alert>
                      Safety gate: anything requiring safe isolation, continuity, insulation resistance, or board work must be carried out by a competent or qualified person.
                    </Alert>
                  ) : null}
                </>
              ) : null}
            </Card>

            <Card className="space-y-4">
              <p className="text-xs uppercase tracking-[0.22em] text-copper-700">Answer log</p>
              {Object.keys(answers).length ? (
                <div className="space-y-3">
                  {Object.entries(answers).map(([key, value]) => {
                    const answeredNode = tree.nodes.find((entry) => entry.key === key);
                    const selectedOption = answeredNode?.options.find((option) => option.value === value);
                    return (
                      <div key={key} className="rounded-[1.2rem] border border-slate-200 bg-sand-100/70 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{answeredNode?.question}</p>
                        <p className="mt-1 font-semibold text-slate-950">{selectedOption?.label ?? value}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm leading-6 text-slate-700">No answers yet. The first choice you make starts building the weighted result profile.</p>
              )}
            </Card>
          </section>
        )}
      </div>
    </ErrorBoundary>
  );
}
