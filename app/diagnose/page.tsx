import Link from "next/link";
import { Card } from "@/components/ui";
import { symptoms } from "@/lib/content";

export default function DiagnosePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Choose a symptom</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {symptoms.map((symptom) => (
          <Link key={symptom.slug} href={`/diagnose/${symptom.slug}`}>
            <Card className="h-full transition hover:border-workshop-700">
              <h2 className="font-semibold">{symptom.title}</h2>
              <p className="text-sm text-workshop-700">Start a safe, guided logic path.</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
