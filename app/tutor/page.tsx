import { TutorConsole } from "@/components/tutor-console";

const mockSessions = [
  { id: "A12", symptom: "RCD trips immediately", result: "faulty appliance", minutes: 3, risk: "high", confidence: "high" },
  { id: "A13", symptom: "Some sockets dead, others live", result: "broken ring final", minutes: 6, risk: "high", confidence: "medium" },
  { id: "A14", symptom: "Socket or switch feels hot / shows burn marks", result: "urgent fire risk", minutes: 2, risk: "urgent", confidence: "high" },
  { id: "A15", symptom: "Lights flicker or dim", result: "loose connection", minutes: 5, risk: "medium", confidence: "medium" }
] as const;

export default function TutorPage() {
  return <TutorConsole sessions={[...mockSessions]} />;
}
