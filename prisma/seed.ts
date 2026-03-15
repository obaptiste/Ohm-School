import { PrismaClient } from "@prisma/client";
import { decisionTrees, faults, learningArticles, symptoms } from "../lib/content";

const prisma = new PrismaClient();

async function main() {
  await prisma.diagnosisAnswer.deleteMany();
  await prisma.diagnosisSession.deleteMany();
  await prisma.decisionOption.deleteMany();
  await prisma.decisionNode.deleteMany();
  await prisma.decisionTree.deleteMany();
  await prisma.symptom.deleteMany();
  await prisma.fault.deleteMany();
  await prisma.learningArticle.deleteMany();

  for (const fault of faults) {
    await prisma.fault.create({ data: {
      slug: fault.slug, title: fault.title, summary: fault.summary, description: fault.description, severity: fault.severity,
      dangerNotes: fault.dangerNotes, commonSymptoms: fault.commonSymptoms, likelyCauses: fault.likelyCauses, safeChecks: fault.safeChecks, escalationRules: fault.escalationRules, escalationGuidance: fault.escalationGuidance, educationalExplanation: fault.educationalExplanation, electricianTestsNext: fault.electricianTestsNext, relatedFaultSlugs: fault.relatedFaultSlugs, tags: fault.tags
    } as any});
  }
  for (const symptom of symptoms) await prisma.symptom.create({ data: { ...symptom, description: "Initial diagnostic symptom" } });
  for (const article of learningArticles) await prisma.learningArticle.create({ data: article });

  for (const tree of decisionTrees) {
    const createdTree = await prisma.decisionTree.create({ data: { slug: tree.slug, title: tree.title, symptomSlug: tree.symptomSlug, startNodeId: tree.startNodeKey } });
    for (const node of tree.nodes) {
      const createdNode = await prisma.decisionNode.create({ data: {
        treeId: createdTree.id, key: node.key, question: node.question, explanation: node.explanation, questionType: node.questionType,
        severity: node.severity, safetyGate: !!node.safetyGate, stopReason: node.stopReason, educationalNote: node.educationalNote, recommendedAction: node.recommendedAction
      }});
      for (const option of node.options) {
        await prisma.decisionOption.create({ data: {
          nodeId: createdNode.id,
          label: option.label,
          value: option.value,
          nextNodeKey: option.nextNodeKey,
          scoreModifier: 0,
          riskBoost: option.riskBoost ?? 0,
          urgentTrigger: option.urgentTrigger ?? false,
          faultWeightAdjustments: option.faultWeightAdjustments ?? {}
        } as any});
      }
    }
  }

  console.log(`Created ${faults.length} faults`);
  console.log(`Created ${symptoms.length} symptoms`);
  console.log(`Created ${learningArticles.length} learning articles`);
  console.log(`Created ${decisionTrees.length} decision trees with all nodes and options`);
  console.log("Database seed completed successfully");
}

main().finally(async () => prisma.$disconnect());
