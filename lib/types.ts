export type Severity = "low" | "medium" | "high" | "urgent";

export type QuestionType = "single_choice" | "multi_choice" | "boolean" | "info";

export type DecisionOption = {
  label: string;
  value: string;
  nextNodeKey?: string;
  faultWeightAdjustments?: Record<string, number>;
  riskBoost?: number;
  urgentTrigger?: boolean;
};

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

export type DecisionTree = {
  slug: string;
  title: string;
  symptomSlug: string;
  startNodeKey: string;
  nodes: DecisionNode[];
};

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
  escalationRules: string[];
  escalationGuidance: string;
  electricianTestsNext: string[];
  educationalExplanation: string;
  relatedFaultSlugs: string[];
  tags: string[];
};
