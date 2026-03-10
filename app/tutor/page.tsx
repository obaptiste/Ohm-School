import { Card } from "@/components/ui";

const mockSessions = [
  { id: "A12", symptom: "RCD trips immediately", result: "faulty appliance", minutes: 3 },
  { id: "A13", symptom: "Some sockets dead, others live", result: "broken ring final", minutes: 6 },
  { id: "A14", symptom: "Socket or switch feels hot / shows burn marks", result: "urgent fire risk", minutes: 2 }
];

export default function TutorPage() {
  const average = Math.round(mockSessions.reduce((acc, s) => acc + s.minutes, 0) / mockSessions.length);
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tutor dashboard</h1>
      <div className="grid gap-3 md:grid-cols-4">
        <Card><p className="text-sm text-workshop-700">Total diagnoses started</p><p className="text-2xl font-bold">{mockSessions.length}</p></Card>
        <Card><p className="text-sm text-workshop-700">Most selected symptom</p><p className="text-lg font-semibold">RCD trips immediately</p></Card>
        <Card><p className="text-sm text-workshop-700">Most common end result</p><p className="text-lg font-semibold">faulty appliance</p></Card>
        <Card><p className="text-sm text-workshop-700">Average completion time</p><p className="text-2xl font-bold">{average} min</p></Card>
      </div>
      <Card>
        <h2 className="mb-2 font-semibold">Recent diagnosis sessions</h2>
        <table className="w-full text-left text-sm"><thead><tr><th>ID</th><th>Symptom</th><th>Result</th><th>Time</th></tr></thead><tbody>{mockSessions.map((s) => <tr key={s.id} className="border-t"><td>{s.id}</td><td>{s.symptom}</td><td>{s.result}</td><td>{s.minutes} min</td></tr>)}</tbody></table>
      </Card>
    </div>
  );
}
