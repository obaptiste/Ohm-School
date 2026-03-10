import { z } from "zod";
import { Severity, QuestionType } from "./types";

export const answerSchema = z.object({
  nodeKey: z.string().min(1, "Node key is required"),
  value: z.string().min(1, "Answer value is required")
});

export const decisionNodeSchema = z.object({
  key: z.string().min(1),
  question: z.string().min(1),
  questionType: z.enum(["single_choice", "multi_choice", "boolean", "info"]),
  explanation: z.string(),
  options: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
      nextNodeKey: z.string().optional(),
      faultWeightAdjustments: z.record(z.number()).optional(),
      riskBoost: z.number().optional(),
      urgentTrigger: z.boolean().optional()
    })
  ).min(1),
  severity: z.enum(["low", "medium", "high", "urgent"]).optional(),
  safetyGate: z.boolean().optional(),
  stopReason: z.string().optional(),
  educationalNote: z.string().optional(),
  recommendedAction: z.string().optional()
});

export const decisionTreeSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  symptomSlug: z.string().min(1),
  startNodeKey: z.string().min(1),
  nodes: z.array(decisionNodeSchema).min(1)
});

export const diagnosisSessionSchema = z.object({
  symptomSlug: z.string().min(1),
  answers: z.record(z.string())
});

type AnswerSchema = z.infer<typeof answerSchema>;
type DecisionNodeSchema = z.infer<typeof decisionNodeSchema>;
type DecisionTreeSchema = z.infer<typeof decisionTreeSchema>;
type DiagnosisSessionSchema = z.infer<typeof diagnosisSessionSchema>;

export type { AnswerSchema, DecisionNodeSchema, DecisionTreeSchema, DiagnosisSessionSchema };
