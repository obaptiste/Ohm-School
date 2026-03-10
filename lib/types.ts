/** Risk severity levels for diagnostic outcomes */
export type Severity = "low" | "medium" | "high" | "urgent";

/** Question presentation types in decision trees */
export type QuestionType = "single_choice" | "multi_choice" | "boolean" | "info";

/** Decision option representing a single answer choice */
export type DecisionOption = {
  label: string;
  value: string;
  nextNodeKey?: string;
  faultWeightAdjustments?: Record<string, number>;
  riskBoost?: number;
  urgentTrigger?: boolean;
};

/** Decision tree node containing a question and multiple choice options */
export type DecisionNode = {
  key: string;
  question: string;
  questionType: QuestionType;
  options: DecisionOption[];
  explanation: string;
  safetyGate?: boolean;
  stopReason?: string;
  severity?: Severity;
  recommendedAction?: string;
  educationalNote?: string;
};

/** Complete decision tree for one symptom */
export type DecisionTree = {
  slug: string;
  title: string;
  symptomSlug: string;
  startNodeKey: string;
  nodes: DecisionNode[];
};

/** Electrical fault with diagnostic and educational information */
export type Fault = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  severity: Severity;
  dangerNotes: string;
  commonSymptoms: string[];
  likelyCauses: string[];
  safeChecks: string[];
  escalationGuidance: string;
  electricianTestsNext: string[];
  educationalExplanation: string;
  tags: string[];
};
