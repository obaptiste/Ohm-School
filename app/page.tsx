import Link from "next/link";
import { Alert, Button, Card } from "@/components/ui";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold">Fault Path UK</h1>
        <p className="text-lg text-workshop-700">Learn domestic fault-finding logic for UK electrical installations</p>
      </section>
      <section className="flex flex-wrap gap-3">
        <Link href="/diagnose" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-workshop-900 rounded">
          <Button>Start diagnosis</Button>
        </Link>
        <Link href="/library" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-workshop-900 rounded">
          <Button className="bg-workshop-700">Explore fault library</Button>
        </Link>
        <Link href="/tutor" className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-workshop-900 rounded">
          <Button className="bg-workshop-700">Tutor view</Button>
        </Link>
      </section>
      <Alert>
        Educational and triage-oriented only. Never remove covers, work live, bypass protective devices, or carry out invasive testing unless competent and qualified.
      </Alert>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-xl font-semibold">What this tool can do</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Structure safe non-invasive observations.</li>
            <li>Explain diagnostic reasoning.</li>
            <li>Flag risk and escalation points clearly.</li>
          </ul>
        </Card>
        <Card>
          <h2 className="mb-2 text-xl font-semibold">What this tool cannot do</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li>Replace a qualified electrician.</li>
            <li>Provide live testing instructions to unqualified users.</li>
            <li>Authorise DIY fixed wiring work.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
