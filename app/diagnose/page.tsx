import { DiagnoseStudio } from "@/components/diagnose-studio";
import { faults, symptoms } from "@/lib/content";

export default function DiagnosePage() {
  return <DiagnoseStudio symptoms={symptoms} faults={faults} />;
}
