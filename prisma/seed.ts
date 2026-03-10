import { PrismaClient } from "@prisma/client";
import { decisionTrees, faults, learningArticles, symptoms } from "../lib/content";

const prisma = new PrismaClient();

async function main() {
  try {
    // Validate environment
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL environment variable is not set");
    }

    console.log("Starting database seed...");

    // Clean up existing data (order matters due to foreign keys)
    await prisma.diagnosisAnswer.deleteMany();
    await prisma.diagnosisSession.deleteMany();
    await prisma.decisionOption.deleteMany();
    await prisma.decisionNode.deleteMany();
    await prisma.decisionTree.deleteMany();
    await prisma.symptom.deleteMany();
    await prisma.fault.deleteMany();
    await prisma.learningArticle.deleteMany();

    // Seed faults
    for (const fault of faults) {
      await prisma.fault.create({
        data: {
          slug: fault.slug,
          title: fault.title,
          summary: fault.summary,
          description: fault.description,
          severity: fault.severity,
          dangerNotes: fault.dangerNotes,
          likelyCauses: fault.likelyCauses,
          safeChecks: fault.safeChecks,
          electricianTestsNext: fault.electricianTestsNext,
          tags: fault.tags
        }
      });
    }
    console.log(`Created ${faults.length} faults`);

    // Seed symptoms
    for (const symptom of symptoms) {
      await prisma.symptom.create({
        data: { slug: symptom.slug, title: symptom.title, description: "Initial diagnostic symptom" }
      });
    }
    console.log(`Created ${symptoms.length} symptoms`);

    // Seed learning articles
    for (const article of learningArticles) {
      await prisma.learningArticle.create({ data: article });
    }
    console.log(`Created ${learningArticles.length} learning articles`);

    // Seed decision trees with nodes and options
    for (const tree of decisionTrees) {
      const createdTree = await prisma.decisionTree.create({
        data: {
          slug: tree.slug,
          title: tree.title,
          symptomSlug: tree.symptomSlug,
          startNodeId: "temp" // Will be updated after nodes are created
        }
      });

      const nodeMap: Record<string, string> = {}; // Map node keys to IDs
      let startNodeId = "";

      // First pass: create all nodes
      for (const node of tree.nodes) {
        const createdNode = await prisma.decisionNode.create({
          data: {
            treeId: createdTree.id,
            key: node.key,
            question: node.question,
            explanation: node.explanation,
            questionType: node.questionType,
            severity: node.severity || null,
            safetyGate: !!node.safetyGate,
            stopReason: node.stopReason || null,
            educationalNote: node.educationalNote || null,
            recommendedAction: node.recommendedAction || null
          }
        });
        nodeMap[node.key] = createdNode.id;
        if (node.key === tree.startNodeKey) startNodeId = createdNode.id;
      }

      // Update tree with correct startNodeId
      await prisma.decisionTree.update({
        where: { id: createdTree.id },
        data: { startNodeId }
      });

      // Second pass: create options (now we have all node IDs)
      for (const node of tree.nodes) {
        const nodeId = nodeMap[node.key];
        for (const option of node.options) {
          await prisma.decisionOption.create({
            data: {
              nodeId,
              label: option.label,
              value: option.value,
              nextNodeKey: option.nextNodeKey || null,
              scoreModifier: 0,
              faultWeightAdjustments: option.faultWeightAdjustments ?? {}
            }
          });
        }
      }
    }
    console.log(`Created ${decisionTrees.length} decision trees with all nodes and options`);
    console.log("Database seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

main().finally(async () => prisma.$disconnect());
