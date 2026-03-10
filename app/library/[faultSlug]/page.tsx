import { Alert, Badge, Card } from "@/components/ui";
import { faults } from "@/lib/content";

const severityClass: Record<string, string> = {
  low: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-orange-100 text-orange-900",
  urgent: "bg-red-100 text-red-800"
};

export default function FaultDetailPage({ params }: { params: { faultSlug: string } }) {
  const fault = faults.find((f) => f.slug === params.faultSlug);
  if (!fault) return <Alert>Fault not found.</Alert>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">{fault.title}</h1>
      <Badge className={severityClass[fault.severity]}>{fault.severity}</Badge>
      <Card><h2 className="font-semibold">Summary</h2><p className="text-sm">{fault.description}</p></Card>
      <Card><h2 className="font-semibold">Common symptoms</h2><ul className="list-disc pl-5 text-sm">{fault.commonSymptoms.map((s) => <li key={s}>{s}</li>)}</ul></Card>
      <Card><h2 className="font-semibold">Typical causes</h2><ul className="list-disc pl-5 text-sm">{fault.likelyCauses.map((s) => <li key={s}>{s}</li>)}</ul></Card>
      <Card><h2 className="font-semibold">What makes it dangerous</h2><p className="text-sm">{fault.dangerNotes}</p></Card>
      <Card>
        <h2 className="font-semibold">What a qualified electrician would typically test next</h2>
        <p className="mb-2 text-xs font-semibold text-red-700">Not for unqualified users.</p>
        <ul className="list-disc pl-5 text-sm">{fault.electricianTestsNext.map((s) => <li key={s}>{s}</li>)}</ul>
      </Card>
      <Card><h2 className="font-semibold">Safe observational checks</h2><ul className="list-disc pl-5 text-sm">{fault.safeChecks.map((s) => <li key={s}>{s}</li>)}</ul></Card>
      <Alert>{fault.escalationGuidance}</Alert>
    </div>
  );
}
