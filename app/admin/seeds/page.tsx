import { Card } from "@/components/ui";
import { decisionTrees, faults, symptoms } from "@/lib/content";

export default function AdminSeedsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Admin seed overview</h1>
      <Card><p className="text-sm">Faults: {faults.length}</p><p className="text-sm">Symptoms: {symptoms.length}</p><p className="text-sm">Decision trees: {decisionTrees.length}</p></Card>
      <Card><pre className="overflow-auto text-xs">{JSON.stringify({ faults: faults.map((f) => f.slug), trees: decisionTrees.map((t) => t.slug) }, null, 2)}</pre></Card>
    </div>
  );
}
