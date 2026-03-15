import { DecisionNode, DecisionTree, Severity } from "./types";

export type AnswerMap = Record<string, string | string[]>;

type RankedFault = { slug: string; score: number };

type FaultScoringResult = {
  scores: Record<string, number>;
  reasons: Record<string, string[]>;
};

export type HybridInferenceResult = {
  topLikelyFault: string | null;
  alternatives: string[];
  confidenceLevel: "low" | "medium" | "high";
  riskLevel: Severity;
  whyChosen: string[];
  escalation: boolean;
  likelyCauses: string[];
};

const toValues = (raw: string | string[] | undefined): string[] => {
  if (!raw) return [];
  return Array.isArray(raw) ? raw : [raw];
};

const getOption = (node: DecisionNode, value: string) => node.options.find((opt) => opt.value === value);

const rankFaults = (scores: Record<string, number>): RankedFault[] =>
  Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([slug, score]) => ({ slug, score }));

export function scoreFaultsFromAnswers(tree: DecisionTree, answers: AnswerMap): FaultScoringResult {
  const scores: Record<string, number> = {};
  const reasons: Record<string, string[]> = {};

  for (const node of tree.nodes) {
    const values = toValues(answers[node.key]);
    for (const value of values) {
      const option = getOption(node, value);
      if (!option) continue;

      Object.entries(option.faultWeightAdjustments ?? {}).forEach(([faultSlug, weight]) => {
        scores[faultSlug] = (scores[faultSlug] ?? 0) + weight;
        reasons[faultSlug] = reasons[faultSlug] ?? [];
        reasons[faultSlug].push(`${node.question} -> ${option.label} (${weight >= 0 ? "+" : ""}${weight})`);
      });
    }
  }

  return { scores, reasons };
}

export function detectUrgentEscalation(tree: DecisionTree, answers: AnswerMap) {
  const triggers: string[] = [];

  for (const node of tree.nodes) {
    const values = toValues(answers[node.key]);
    for (const value of values) {
      const option = getOption(node, value);
      if (!option?.urgentTrigger) continue;
      triggers.push(`${node.question} -> ${option.label}`);
    }
  }

  return { urgent: triggers.length > 0, triggers };
}

export function computeRiskLevel(tree: DecisionTree, answers: AnswerMap): { riskLevel: Severity; riskScore: number } {
  let riskScore = 0;

  for (const node of tree.nodes) {
    const values = toValues(answers[node.key]);
    for (const value of values) {
      const option = getOption(node, value);
      if (!option) continue;
      riskScore += option.riskBoost ?? 0;
    }
  }

  const urgent = detectUrgentEscalation(tree, answers).urgent;
  const riskLevel: Severity = urgent || riskScore >= 4 ? "urgent" : riskScore >= 2 ? "high" : riskScore >= 1 ? "medium" : "low";
  return { riskLevel, riskScore };
}

export function chooseNextQuestion(
  tree: DecisionTree,
  currentNodeKey: string,
  answers: AnswerMap,
  selectedAnswer?: string
): string | undefined {
  const node = tree.nodes.find((n) => n.key === currentNodeKey);
  if (!node) return undefined;

  const evaluatedAnswers = selectedAnswer ? [selectedAnswer] : toValues(answers[currentNodeKey]);

  for (const answer of evaluatedAnswers) {
    const option = getOption(node, answer);
    if (option?.nextNodeKey) return option.nextNodeKey;
  }

  return tree.nodes.find((candidate) => !answers[candidate.key])?.key;
}

export function buildResultSummary(tree: DecisionTree, answers: AnswerMap): HybridInferenceResult {
  const { scores, reasons } = scoreFaultsFromAnswers(tree, answers);
  const ranked = rankFaults(scores);
  const { riskLevel, riskScore } = computeRiskLevel(tree, answers);
  const { urgent, triggers } = detectUrgentEscalation(tree, answers);

  const topLikelyFault = ranked[0]?.slug ?? null;
  const alternatives = ranked.slice(1, 3).map((entry) => entry.slug);
  const topScore = ranked[0]?.score ?? 0;
  const totalScore = ranked.reduce((acc, entry) => acc + Math.max(entry.score, 0), 0);
  const ratio = totalScore > 0 ? topScore / totalScore : 0;
  const confidenceLevel: "low" | "medium" | "high" = ratio >= 0.6 ? "high" : ratio >= 0.35 ? "medium" : "low";

  const whyChosen = [
    `Risk score: ${riskScore} (${riskLevel}).`,
    ...(urgent ? [`Urgent safety trigger(s): ${triggers.join("; ")}.`] : []),
    ...(topLikelyFault ? (reasons[topLikelyFault] ?? []).slice(0, 3) : ["No strong weighted signal was collected from answers yet."])
  ];

  return {
    topLikelyFault,
    alternatives,
    confidenceLevel,
    riskLevel,
    whyChosen,
    escalation: urgent || riskLevel === "urgent",
    likelyCauses: ranked.slice(0, 3).map((entry) => entry.slug)
  };
}

export function runInference(tree: DecisionTree, answers: AnswerMap): HybridInferenceResult {
  return buildResultSummary(tree, answers);
}
