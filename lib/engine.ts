import { DecisionTree, Severity } from "./types";

export type AnswerMap = Record<string, string | string[]>;

/**
 * Runs diagnostic inference on a decision tree based on user answers.
 * Scores likely causes based on weighted adjustments and determines risk level.
 * @param tree - The decision tree to run inference on
 * @param answers - User answers mapped by node key
 * @returns Object containing likely causes, risk level, and escalation flag
 */
export function runInference(tree: DecisionTree, answers: AnswerMap) {
  const scores: Record<string, number> = {};
  let risk = 0;
  let urgent = false;

  for (const node of tree.nodes) {
    const raw = answers[node.key];
    if (!raw) continue;
    const values = Array.isArray(raw) ? raw : [raw];

    for (const value of values) {
      const option = node.options.find((o) => o.value === value);
      if (!option) continue;
      Object.entries(option.faultWeightAdjustments ?? {}).forEach(([fault, weight]) => {
        scores[fault] = (scores[fault] ?? 0) + weight;
      });
      risk += option.riskBoost ?? 0;
      if (option.urgentTrigger) urgent = true;
    }
  }

  const likelyCauses = Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([cause]) => cause);

  const riskLevel: Severity = urgent || risk >= 4 ? "urgent" : risk >= 2 ? "high" : risk >= 1 ? "medium" : "low";
  const escalation = riskLevel === "urgent" || likelyCauses.some((cause) => cause.includes("N-E") || cause.includes("overheating"));

  return { likelyCauses, riskLevel, escalation };
}
