import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import { faults } from "@/lib/content";

export default function LibraryPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Fault library</h1>
      <div className="grid gap-3 md:grid-cols-2">
        {faults.map((fault) => (
          <Link href={`/library/${fault.slug}`} key={fault.slug}>
            <Card className="h-full space-y-2">
              <h2 className="font-semibold">{fault.title}</h2>
              <p className="text-sm text-workshop-700">{fault.summary}</p>
              <div className="flex flex-wrap gap-2">{fault.tags.map((tag) => <Badge className="bg-workshop-300 text-workshop-900" key={tag}>{tag}</Badge>)}</div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
