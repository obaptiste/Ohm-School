"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Alert, Badge, Button, Card, Progress } from "@/components/ui";
import { ErrorBoundary } from "@/components/error-boundary";
import { decisionTrees, learningArticles, symptoms } from "@/lib/content";
import { runInference } from "@/lib/engine";
import { answerSchema } from "@/lib/validation";

const severityClass: Record<string, string> = {
  low: "bg-green-100 text-green-800",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-900",
  urgent: "bg-red-100 text-red-800"
};

interface PageProps {
  params: Promise<{ symptomSlug: string }>;
}

export default function SymptomFlowPage({ params }: PageProps) {
  return <SymptomFlowPageContent params={params} />;
}

function SymptomFlowPageContent({ params }: { params: Promise<{ symptomSlug: string }> }) {
  const [resolvedParams, setResolvedParams] = useState<{ symptomSlug: string } | null>(null);

  useMemo(() => {
    params.then(setResolvedParams).catch(() => setResolvedParams(null));
  }, [params]);

  if (!resolvedParams) return null;

  return <SymptomFlowPageInner symptomSlug={resolvedParams.symptomSlug} />;
}

function SymptomFlowPageInner({ symptomSlug }: { symptomSlug: string }) {
  const symptom = symptoms.find((s) => s.slug === symptomSlug);
  const tree = decisionTrees.find((t) => t.symptomSlug === symptomSlug);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentKey, setCurrentKey] = useState(tree?.startNodeKey);

  const node = tree?.nodes.find((n) => n.key === currentKey);
  const progress = tree ? Math.round((Object.keys(answers).length / tree.nodes.length) * 100) : 0;
  const result = useMemo(() => (tree ? runInference(tree, answers) : null), [answers, tree]);
  const complete = tree ? Object.keys(answers).length >= tree.nodes.length || !node : false;

  if (!symptom) return <Alert>Unknown symptom.</Alert>;
  if (!tree) return <Alert>This symptom has library content but no full decision tree yet. Please use Tutor view for planned expansion.</Alert>;

  const submitAnswer = (value: string, nextNodeKey?: string) => {
    if (!node) return;
    const parsed = answerSchema.safeParse({ nodeKey: node.key, value });
    if (!parsed.success) return;
    setAnswers((prev) => ({ ...prev, [node.key]: parsed.data.value }));
    setCurrentKey(nextNodeKey);
  };

  return (
    <ErrorBoundary>
      {complete && result ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Result: {symptom.title}</h1>
          <Badge className={severityClass[result.riskLevel]}>{result.riskLevel === "medium" ? "caution" : result.riskLevel}</Badge>
          <Card>
            <h2 className="font-semibold">Top likely causes</h2>
            <ol className="list-decimal pl-5 text-sm">{result.likelyCauses.map((c) => <li key={c}>{c}</li>)}</ol>
          </Card>
          <Card>
            <h2 className="font-semibold">Safe next checks</h2>
            <ul className="list-disc pl-5 text-sm">
              <li>Confirm which protective device has tripped.</li>
              <li>Unplug portable appliances and observe changes.</li>
              <li>Look for visible damage only; do not dismantle accessories.</li>
            </ul>
          </Card>
          <Card>
            <h2 className="font-semibold">Why this conclusion</h2>
            <p className="text-sm">Your answers increased weightings for the listed causes and triggered independent risk logic for escalation markers such as heat, damage, or repeated tripping.</p>
          </Card>
          <Alert>{result.escalation ? "Call a qualified electrician now." : "Safe to continue observing for now; escalate if symptoms worsen."}</Alert>
          {(() => {
            const related = learningArticles.filter((a) => result.likelyCauses.some((cause) => a.relatedFaultSlugs.some((slug) => cause.includes(slug.split("-")[0]))));
            return related.length > 0 ? (
              <Card>
                <h2 className="font-semibold">Related learning links</h2>
                <ul className="list-disc pl-5 text-sm">{related.map((a) => <li key={a.slug}><Link href={`/library/${a.relatedFaultSlugs[0]}`}>{a.title}</Link></li>)}</ul>
              </Card>
            ) : null;
          })()}
          <Link href="/diagnose"><Button>Restart</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Diagnose: {symptom.title}</h1>
          <Progress value={progress} />
          {node && (
            <Card>
              <h2 className="mb-2 text-lg font-semibold">{node.question}</h2>
              <details className="mb-3 text-sm text-workshop-700">
                <summary className="cursor-pointer font-medium">Why am I being asked this?</summary>
                <p>{node.explanation}</p>
              </details>
              <div className="flex flex-wrap gap-2">
                {node.options.map((option) => (
                  <Button key={option.value} onClick={() => submitAnswer(option.value, option.nextNodeKey)}>{option.label}</Button>
                ))}
              </div>
              {node.safetyGate && <Alert className="mt-3">Safety gate: further checks requiring isolation, continuity, insulation resistance, or board work must be done by a competent or qualified person.</Alert>}
            </Card>
          )}
        </div>
      )}
    </ErrorBoundary>
  );
}
